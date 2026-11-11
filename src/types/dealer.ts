import type { EntityId, ISODateString, ListParams } from './common'

export type DealerStatus = 'active' | 'pending' | 'suspended' | 'inactive'

export type DealerPlan = 'free' | 'growth' | 'pro'

export type DealerVerificationStatus = 'verified' | 'in_review' | 'unverified' | 'rejected'

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
  verificationStatus: DealerVerificationStatus
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
  | 'joinedAt'
  | 'lastActiveAt'
  | 'garageVehicles'
  | 'marketplaceVehicles'
  | 'aiReels'

export interface DealerListParams extends ListParams<DealerSortField> {
  status?: DealerStatus
  /** Matches dealers on any of the given plans. */
  plans?: DealerPlan[]
}
