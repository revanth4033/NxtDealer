import type { EntityId, ISODateString, ListParams, Money } from './common'

/*
 * Garage and marketplace model
 * ------------------------------------------------------------
 * A GarageVehicle is every vehicle a dealer has added to their app inventory.
 * Publishing to the shared marketplace does not create a new vehicle — it changes the
 * vehicle's `marketplace` state. Marketplace listings are therefore a filtered view of
 * garage vehicles and must never be added to garage totals.
 */

export type BodyType = 'hatchback' | 'sedan' | 'suv' | 'mpv'

export type FuelType = 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid'

export type Transmission = 'manual' | 'automatic'

export interface VehicleSpecs {
  make: string
  model: string
  variant?: string
  year: number
  bodyType: BodyType
  fuelType: FuelType
  transmission: Transmission
  odometerKm: number
  colour: string
  /** Number of previous registered owners. */
  owners: number
}

export type MarketplaceStatus = 'published' | 'unpublished'

/** Whether the vehicle is currently visible on the shared marketplace. */
export type VehicleMarketplaceState =
  | { status: 'published'; publishedAt: ISODateString }
  | { status: 'unpublished' }

export interface GarageVehicle {
  id: EntityId
  dealerId: EntityId
  dealerName: string
  /** Display name, e.g. "2022 Hyundai Creta SX(O)". */
  title: string
  specs: VehicleSpecs
  /** Dealer's asking price. */
  price: Money
  city: string
  /** Photo URLs, first is the cover. May be empty. */
  photos: string[]
  marketplace: VehicleMarketplaceState
  /** Number of AI reels generated for this vehicle (computed by the service). */
  aiReelCount: number
  addedAt: ISODateString
}

/** A vehicle currently published to the marketplace. */
export type MarketplaceVehicle = GarageVehicle & {
  marketplace: Extract<VehicleMarketplaceState, { status: 'published' }>
}

export type GarageSortField = 'addedAt' | 'price' | 'year'

export interface GarageListParams extends ListParams<GarageSortField> {
  dealerId?: EntityId
  marketplaceStatus?: MarketplaceStatus
}

export type MarketplaceSortField = 'publishedAt' | 'price' | 'year'

/**
 * Marketplace directory filters. Values within one filter match any of them (OR); different filters
 * all have to match (AND). Omitted or empty means no restriction. Range bounds are inclusive and either
 * side may be omitted; a minimum above its maximum is rejected by the service.
 */
export interface MarketplaceFilters {
  /** Restricts to one dealer's listings (dashboard and dealer details). Not a directory filter. */
  dealerId?: EntityId
  /** Searches make, model, variant, dealer name, city and colour. */
  search?: string
  dealerIds?: EntityId[]
  cities?: string[]
  makes?: string[]
  /**
   * Model names. Models refine their own make: a selected make with none of its models selected keeps
   * all of them. With no make selected, only the selected models match.
   */
  models?: string[]
  fuelTypes?: FuelType[]
  transmissions?: Transmission[]
  yearMin?: number
  yearMax?: number
  /** Asking price in rupees. */
  priceMin?: number
  priceMax?: number
}

export interface MarketplaceListParams extends ListParams<MarketplaceSortField>, MarketplaceFilters {}
