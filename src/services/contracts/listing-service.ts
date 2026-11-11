import type { EntityId, ListingListParams, MarketplaceListing, PaginatedResponse } from '@/types'

export interface ListingService {
  list(params?: ListingListParams): Promise<PaginatedResponse<MarketplaceListing>>
  getById(id: EntityId): Promise<MarketplaceListing>
}
