import type { SortingState } from '@tanstack/react-table'
import { useMemo } from 'react'

import { FUEL_LABELS, TRANSMISSION_LABELS } from '@/features/garage/vehicle-labels'
import { useUrlState } from '@/hooks/use-url-state'
import { getRangeError, isRangeSet, parseRangeBound, type NumberRange } from '@/lib/range'
import type { FuelType, MarketplaceFilters, MarketplaceListParams, MarketplaceSortField, SortDirection, Transmission } from '@/types'

export const MARKETPLACE_PAGE_SIZES = [12, 24, 48]
const DEFAULT_PAGE_SIZE = 12

export type MarketplaceView = 'table' | 'grid'

export interface MarketplaceSort {
  field: MarketplaceSortField
  direction: SortDirection
}

/** Newest listings first unless the admin picks another order. */
export const DEFAULT_MARKETPLACE_SORT: MarketplaceSort = { field: 'publishedAt', direction: 'desc' }

const SORT_FIELDS: readonly MarketplaceSortField[] = ['publishedAt', 'price', 'year']

const isSortField = (value: string): value is MarketplaceSortField => SORT_FIELDS.includes(value as MarketplaceSortField)
const keysOf = <T extends string>(map: Record<T, unknown>) => (value: string): value is T => Object.hasOwn(map, value)
const isFuelType = keysOf<FuelType>(FUEL_LABELS)
const isTransmission = keysOf<Transmission>(TRANSMISSION_LABELS)

const orUndefined = <T>(values: T[]) => (values.length ? values : undefined)
const unique = <T>(values: T[]) => [...new Set(values)]

/** Reads a range from the URL. A hand-edited URL with a bad or inverted range applies no restriction for it. */
function readRange(minText: string | undefined, maxText: string | undefined): NumberRange {
  const min = parseRangeBound(minText)
  const max = parseRangeBound(maxText)
  if (min === 'invalid' || max === 'invalid') return {}
  const range = { min, max }
  return getRangeError(range) ? {} : range
}

/**
 * Marketplace directory view state, kept in the URL so every filtered view is linkable and survives
 * reloads and Back navigation. Table and grid views share all of it. Unknown values are ignored.
 *
 *   ?q=  ·  dealer=  city=  make=  model=  fuel=  transmission=  (repeatable)
 *   yearFrom=  yearTo=  priceMin=  priceMax=  ·  sort=field:dir  ·  page=  size=  ·  view=grid
 */
export function useMarketplaceState() {
  const url = useUrlState()

  return useMemo(() => {
    const search = url.get('q') ?? ''
    const dealerIds = unique(url.getAll('dealer'))
    const cities = unique(url.getAll('city'))
    const makes = unique(url.getAll('make'))
    const models = unique(url.getAll('model'))
    const fuelTypes = unique(url.getAll('fuel').filter(isFuelType))
    const transmissions = unique(url.getAll('transmission').filter(isTransmission))
    const year = readRange(url.get('yearFrom'), url.get('yearTo'))
    const price = readRange(url.get('priceMin'), url.get('priceMax'))

    const page = url.getNumber('page', 1)
    const requestedSize = url.getNumber('size', DEFAULT_PAGE_SIZE)
    const pageSize = MARKETPLACE_PAGE_SIZES.includes(requestedSize) ? requestedSize : DEFAULT_PAGE_SIZE
    const view: MarketplaceView = url.get('view') === 'grid' ? 'grid' : 'table'

    const [sortField = '', sortDirection] = (url.get('sort') ?? '').split(':')
    const sort: MarketplaceSort = isSortField(sortField)
      ? { field: sortField, direction: sortDirection === 'asc' ? 'asc' : 'desc' }
      : DEFAULT_MARKETPLACE_SORT
    const sorting: SortingState = [{ id: sort.field, desc: sort.direction === 'desc' }]

    /** Everything that decides which listings match. Also the input for faceted counts. */
    const filters: MarketplaceFilters = {
      search: search || undefined,
      dealerIds: orUndefined(dealerIds),
      cities: orUndefined(cities),
      makes: orUndefined(makes),
      models: orUndefined(models),
      fuelTypes: orUndefined(fuelTypes),
      transmissions: orUndefined(transmissions),
      yearMin: year.min,
      yearMax: year.max,
      priceMin: price.min,
      priceMax: price.max,
    }
    const params: MarketplaceListParams = {
      ...filters,
      page,
      pageSize,
      sortBy: sort.field,
      sortDirection: sort.direction,
    }

    const activeFilterCount =
      dealerIds.length +
      cities.length +
      makes.length +
      models.length +
      fuelTypes.length +
      transmissions.length +
      Number(isRangeSet(year)) +
      Number(isRangeSet(price))

    const writeSort = (next: MarketplaceSort) => {
      const isDefault = next.field === DEFAULT_MARKETPLACE_SORT.field && next.direction === DEFAULT_MARKETPLACE_SORT.direction
      url.update({ sort: isDefault ? null : `${next.field}:${next.direction}`, page: null })
    }
    const writeRange = (minKey: string, maxKey: string) => (next: NumberRange) => {
      if (getRangeError(next)) return false
      url.update({ [minKey]: next.min ?? null, [maxKey]: next.max ?? null, page: null })
      return true
    }

    return {
      params,
      filters,
      search,
      dealerIds,
      cities,
      makes,
      models,
      fuelTypes,
      transmissions,
      year,
      price,
      page,
      pageSize,
      sort,
      sorting,
      view,
      activeFilterCount,
      hasFilters: Boolean(search) || activeFilterCount > 0,

      // Any change to what's shown returns to page 1.
      setSearch: (next: string) => url.update({ q: next, page: null }),
      setDealerIds: (next: string[]) => url.update({ dealer: next, page: null }),
      setCities: (next: string[]) => url.update({ city: next, page: null }),
      /**
       * Models depend on makes: a model stays selected only while its make is. Models chosen with no
       * make selected are kept until a make is chosen. `makeOfModel` comes from the facets.
       */
      setMakes: (next: string[], makeOfModel: (model: string) => string | undefined) => {
        const keptModels = next.length
          ? models.filter((model) => next.includes(makeOfModel(model) ?? ''))
          : makes.length
            ? []
            : models
        url.update({ make: next, model: keptModels, page: null })
      },
      setModels: (next: string[]) => url.update({ model: next, page: null }),
      setFuelTypes: (next: FuelType[]) => url.update({ fuel: next, page: null }),
      setTransmissions: (next: Transmission[]) => url.update({ transmission: next, page: null }),
      /** Applies a year range. Returns `false`, leaving the URL unchanged, when the range is invalid. */
      setYearRange: writeRange('yearFrom', 'yearTo'),
      /** Applies a price range in rupees. Returns `false`, leaving the URL unchanged, when the range is invalid. */
      setPriceRange: writeRange('priceMin', 'priceMax'),

      setSort: writeSort,
      /** Table header sorting. Clearing a sort (third click) falls back to newest first. */
      setSorting: (next: SortingState) => {
        const [first] = next
        writeSort(first && isSortField(first.id) ? { field: first.id, direction: first.desc ? 'desc' : 'asc' } : DEFAULT_MARKETPLACE_SORT)
      },
      // Page changes add a history entry so Back returns to the previous page; corrections replace it.
      setPage: (next: number, options: { replace?: boolean } = {}) =>
        url.update({ page: next > 1 ? next : null }, { replace: options.replace ?? false }),
      setPageSize: (next: number) => url.update({ size: next === DEFAULT_PAGE_SIZE ? null : next, page: null }),
      // Switching views keeps the page: both views show the same results in the same order.
      setView: (next: MarketplaceView) => url.update({ view: next === 'grid' ? next : null }),
      clearFilters: () =>
        url.update({
          q: null,
          dealer: null,
          city: null,
          make: null,
          model: null,
          fuel: null,
          transmission: null,
          yearFrom: null,
          yearTo: null,
          priceMin: null,
          priceMax: null,
          page: null,
        }),
    }
    // `url` is memoised on the search params, so the state only changes when the URL does.
  }, [url])
}
