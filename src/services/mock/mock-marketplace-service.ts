import { mockVehicles } from '@/mocks/vehicles'
import { ApiError } from '@/services/errors'
import type { MarketplaceService } from '@/services/contracts'
import type {
  FacetCount,
  FuelType,
  GarageVehicle,
  MarketplaceFacets,
  MarketplaceFilters,
  MarketplaceSortField,
  MarketplaceVehicle,
  RankedCount,
  Transmission,
} from '@/types'

import { vehicleSearchFields } from './mock-garage-service'
import { matchesSearch, queryCollection, simulateLatency } from './mock-utils'

const isPublished = (vehicle: GarageVehicle): vehicle is MarketplaceVehicle => vehicle.marketplace.status === 'published'

// The marketplace is a view over garage vehicles — never a separate inventory.
const publishedVehicles: readonly MarketplaceVehicle[] = mockVehicles.filter(isPublished)

const sortAccessors: Record<MarketplaceSortField, (vehicle: MarketplaceVehicle) => string | number> = {
  publishedAt: (v) => v.marketplace.publishedAt,
  price: (v) => v.price.amount,
  year: (v) => v.specs.year,
}

/** Filters with their own facet. Search, ranges and the dealer scope always apply. */
type FacetedFilter = 'dealerIds' | 'cities' | 'makes' | 'models' | 'fuelTypes' | 'transmissions'

const facetValue: Record<FacetedFilter, (vehicle: MarketplaceVehicle) => string> = {
  dealerIds: (v) => v.dealerId,
  cities: (v) => v.city,
  makes: (v) => v.specs.make,
  models: (v) => v.specs.model,
  fuelTypes: (v) => v.specs.fuelType,
  transmissions: (v) => v.specs.transmission,
}
const FACETED_FILTERS = Object.keys(facetValue) as FacetedFilter[]

// Records (not arrays) so adding a fuel type or transmission is a compile error until it's ordered here.
const FUEL_ORDER: Record<FuelType, number> = { petrol: 0, diesel: 1, cng: 2, electric: 3, hybrid: 4 }
const TRANSMISSION_ORDER: Record<Transmission, number> = { manual: 0, automatic: 1 }

const compareText = (a: string, b: string) => a.localeCompare(b, 'en-IN', { sensitivity: 'base' })

function assertValidRanges(filters: MarketplaceFilters) {
  const ranges = [
    ['yearMin', filters.yearMin, 'yearMax', filters.yearMax],
    ['priceMin', filters.priceMin, 'priceMax', filters.priceMax],
  ] as const
  for (const [minName, min, maxName, max] of ranges) {
    for (const [name, value] of [[minName, min], [maxName, max]] as const) {
      if (value !== undefined && !Number.isFinite(value)) throw ApiError.badRequest(`${name} must be a number.`)
    }
    if (min !== undefined && max !== undefined && min > max) throw ApiError.badRequest(`${minName} must not exceed ${maxName}.`)
  }
}

const inRange = (value: number, min: number | undefined, max: number | undefined) =>
  (min === undefined || value >= min) && (max === undefined || value <= max)

/** Model names are unique across makes in the catalogue, so a model identifies its make. */
const makeOfModel = new Map(publishedVehicles.map((vehicle) => [vehicle.specs.model, vehicle.specs.make]))

/**
 * Models refine their own make. With makes selected, a vehicle passes if its model is selected, or if
 * none of the selected models belongs to its make (choosing Hyundai › Creta and Kia shows Creta plus
 * every Kia). With no make selected, models filter on their own. Counting the make facet assumes the
 * make being counted is selected.
 */
function matchesModels(vehicle: MarketplaceVehicle, filters: MarketplaceFilters, ignore?: FacetedFilter) {
  const models = filters.models
  if (ignore === 'models' || !models?.length || models.includes(vehicle.specs.model)) return true
  const makesApply = ignore === 'makes' || Boolean(filters.makes?.length)
  return makesApply && !models.some((model) => makeOfModel.get(model) === vehicle.specs.make)
}

/** Every filter applies, except the one named in `ignore` (used to count that filter's own options). */
function matchesFilters(vehicle: MarketplaceVehicle, filters: MarketplaceFilters, ignore?: FacetedFilter) {
  if (filters.dealerId && vehicle.dealerId !== filters.dealerId) return false
  for (const filter of FACETED_FILTERS) {
    if (filter === 'models') continue
    const selected: readonly string[] | undefined = filters[filter]
    if (filter !== ignore && selected?.length && !selected.includes(facetValue[filter](vehicle))) return false
  }
  return (
    matchesModels(vehicle, filters, ignore) &&
    inRange(vehicle.specs.year, filters.yearMin, filters.yearMax) &&
    inRange(vehicle.price.amount, filters.priceMin, filters.priceMax) &&
    matchesSearch(vehicle, filters.search, vehicleSearchFields)
  )
}

function countBy(vehicles: readonly MarketplaceVehicle[], value: (vehicle: MarketplaceVehicle) => string) {
  const counts = new Map<string, number>()
  for (const vehicle of vehicles) counts.set(value(vehicle), (counts.get(value(vehicle)) ?? 0) + 1)
  return counts
}

/** Highest count first; ties alphabetically by label so the order is stable. */
function rank(vehicles: readonly MarketplaceVehicle[], key: (v: MarketplaceVehicle) => string, label: (v: MarketplaceVehicle) => string) {
  const labels = new Map(vehicles.map((vehicle) => [key(vehicle), label(vehicle)]))
  return [...countBy(vehicles, key)]
    .map(([value, count]): RankedCount => ({ key: value, label: labels.get(value)!, count }))
    .sort((a, b) => b.count - a.count || compareText(a.label, b.label))
}

const extent = (values: number[]) => ({ min: Math.min(...values), max: Math.max(...values) })

export const mockMarketplaceService: MarketplaceService = {
  async list(params = {}) {
    await simulateLatency()
    assertValidRanges(params)
    // Filters (and search) first, then sort and page.
    const matching = publishedVehicles.filter((vehicle) => matchesFilters(vehicle, params))
    return queryCollection(
      matching,
      { ...params, search: undefined, sortBy: params.sortBy ?? 'publishedAt', sortDirection: params.sortDirection ?? 'desc' },
      { searchFields: vehicleSearchFields, sortAccessors },
    )
  },

  async getInsights() {
    await simulateLatency()
    const byDealer = rank(publishedVehicles, (v) => v.dealerId, (v) => v.dealerName)
    const byCity = rank(publishedVehicles, (v) => v.city, (v) => v.city)
    const byMake = rank(publishedVehicles, (v) => v.specs.make, (v) => v.specs.make)
    return {
      totals: {
        publishedListings: publishedVehicles.length,
        dealersWithListings: byDealer.length,
        cities: byCity.length,
        makes: byMake.length,
      },
      byDealer,
      byCity,
      byMake,
    }
  },

  async getFacets(filters = {}) {
    await simulateLatency()
    assertValidRanges(filters)
    // Options come from every listing in scope, so they don't disappear as filters narrow the counts.
    const scope = publishedVehicles.filter((vehicle) => !filters.dealerId || vehicle.dealerId === filters.dealerId)

    const countsFor = (filter: FacetedFilter) =>
      countBy(scope.filter((vehicle) => matchesFilters(vehicle, filters, filter)), facetValue[filter])

    function optionsFor<T extends string>(filter: FacetedFilter, compare: (a: T, b: T) => number): FacetCount<T>[] {
      const counts = countsFor(filter)
      const values = [...new Set(scope.map((vehicle) => facetValue[filter](vehicle) as T))].sort(compare)
      return values.map((value) => ({ value, count: counts.get(value) ?? 0 }))
    }

    const dealerNames = new Map(scope.map((vehicle) => [vehicle.dealerId, vehicle.dealerName]))
    const modelMakes = new Map(scope.map((vehicle) => [vehicle.specs.model, vehicle.specs.make]))

    return {
      total: scope.filter((vehicle) => matchesFilters(vehicle, filters)).length,
      dealers: optionsFor<string>('dealerIds', (a, b) => compareText(dealerNames.get(a)!, dealerNames.get(b)!)).map((option) => ({
        ...option,
        name: dealerNames.get(option.value)!,
      })),
      cities: optionsFor<string>('cities', compareText),
      makes: optionsFor<string>('makes', compareText),
      models: optionsFor<string>(
        'models',
        (a, b) => compareText(modelMakes.get(a)!, modelMakes.get(b)!) || compareText(a, b),
      ).map((option) => ({ ...option, make: modelMakes.get(option.value)! })),
      fuelTypes: optionsFor<FuelType>('fuelTypes', (a, b) => FUEL_ORDER[a] - FUEL_ORDER[b]),
      transmissions: optionsFor<Transmission>('transmissions', (a, b) => TRANSMISSION_ORDER[a] - TRANSMISSION_ORDER[b]),
      bounds: scope.length
        ? {
            year: extent(scope.map((vehicle) => vehicle.specs.year)),
            price: extent(scope.map((vehicle) => vehicle.price.amount)),
          }
        : null,
    } satisfies MarketplaceFacets
  },
}
