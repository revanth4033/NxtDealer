import type { EntityId, ISODateString } from './common'
import type { DealerStatus } from './dealer'

/** Inventory counts for a scope (whole platform or one dealer). */
export interface InventoryTotals {
  /** Every vehicle in scope, published or not. */
  garageVehicles: number
  /** Vehicles currently published to the marketplace (subset of garageVehicles). */
  marketplaceVehicles: number
  /** garageVehicles − marketplaceVehicles. */
  unpublishedVehicles: number
  /** Reel records. One vehicle can have several. */
  aiReels: number
  /** Distinct vehicles that have at least one reel. */
  vehiclesWithReels: number
}

export interface DealerPopulation {
  total: number
  byStatus: Record<DealerStatus, number>
  /** Dealers with at least one vehicle in their garage. */
  withGarageVehicles: number
  /** Dealers with at least one marketplace vehicle. */
  withMarketplaceVehicles: number
}

export type DashboardScope = { type: 'platform' } | { type: 'dealer'; dealerId: EntityId }

export interface DashboardSummary {
  scope: DashboardScope
  totals: InventoryTotals
  /** Only present for the platform scope. */
  dealers?: DealerPopulation
  generatedAt: ISODateString
}

export interface DashboardSummaryParams {
  /** Omit for platform-wide totals. */
  dealerId?: EntityId
}
