import type { EntityId } from './common'
import type { FuelType, Transmission } from './vehicle'

/*
 * Marketplace monitoring aggregates. Every number is computed from the vehicles that are currently
 * published. There is no publication history, so nothing here describes change over time.
 */

/** One row of a ranking, highest count first. */
export interface RankedCount<TKey extends string = string> {
  key: TKey
  label: string
  count: number
}

export interface MarketplaceInsights {
  totals: {
    publishedListings: number
    /** Distinct dealers with at least one published vehicle. */
    dealersWithListings: number
    /** Distinct cities with at least one published vehicle (the dealer's city). */
    cities: number
    /** Distinct vehicle makes among published vehicles. */
    makes: number
  }
  /** Every dealer with published vehicles. `key` is the dealer id. Ties are ordered by name. */
  byDealer: RankedCount<EntityId>[]
  byCity: RankedCount[]
  byMake: RankedCount[]
}

/** A filter option and how many results it would give alongside the other active filters. */
export interface FacetCount<TValue extends string = string> {
  value: TValue
  count: number
}

/**
 * Faceted option counts for the marketplace filters. Each filter's counts apply every other active
 * filter (including search) but not that filter's own selection, so options can be combined without
 * the list collapsing. Every option on the marketplace is listed, including those whose count is 0.
 */
export interface MarketplaceFacets {
  /** Listings matching every active filter. */
  total: number
  /** Ordered by dealer name. */
  dealers: (FacetCount<EntityId> & { name: string })[]
  /** Ordered alphabetically. */
  cities: FacetCount[]
  /** Ordered alphabetically. */
  makes: FacetCount[]
  /** Ordered by make, then model. Counts reflect the make filter, so models of unselected makes count 0. */
  models: (FacetCount & { make: string })[]
  /** In `FuelType` declaration order. */
  fuelTypes: FacetCount<FuelType>[]
  /** In `Transmission` declaration order. */
  transmissions: FacetCount<Transmission>[]
  /** Lowest and highest values across every listing in scope, for range-input hints. `null` when there are none. */
  bounds: {
    year: { min: number; max: number }
    price: { min: number; max: number }
  } | null
}
