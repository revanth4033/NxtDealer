import type { MarketplaceListParams, MarketplaceVehicle, PaginatedResponse } from '@/types'

/** The shared marketplace: garage vehicles that are currently published. Read-only for admins. */
export interface MarketplaceService {
  list(params?: MarketplaceListParams): Promise<PaginatedResponse<MarketplaceVehicle>>
}
