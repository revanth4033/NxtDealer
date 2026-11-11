import type { EntityId, ISODateString, ListParams } from './common'

/**
 * Account status. Dealers are onboarded directly when they join NxtDealer (there is no approval or
 * verification step), so an account is either active or suspended.
 */
export type DealerStatus = 'active' | 'suspended'

export type DealerPlan = 'free' | 'growth' | 'pro'

export interface DealerLocation {
  city: string
  state: string
}

export interface Dealer {
  id: EntityId
  businessName: string
  ownerName: string
  email: string
  phone: string
  location: DealerLocation
  status: DealerStatus
  plan: DealerPlan
  /** Counts computed by the service from garage, marketplace and reel records. */
  stats: DealerInventoryStats
  joinedAt: ISODateString
  lastActiveAt: ISODateString
}

export interface DealerInventoryStats {
  garageVehicles: number
  /** Subset of garageVehicles currently published. */
  marketplaceVehicles: number
  aiReels: number
}

export type DealerSortField =
  | 'businessName'
  | 'city'
  | 'joinedAt'
  | 'lastActiveAt'
  | 'garageVehicles'
  | 'marketplaceVehicles'
  | 'aiReels'

/** Each filter matches dealers with any of the given values; omitted or empty means no filter. */
export interface DealerListParams extends ListParams<DealerSortField> {
  statuses?: DealerStatus[]
  plans?: DealerPlan[]
}
