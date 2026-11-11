import type { Dealer, DealerListParams, EntityId, PaginatedResponse } from '@/types'

export interface DealerService {
  list(params?: DealerListParams): Promise<PaginatedResponse<Dealer>>
  getById(id: EntityId): Promise<Dealer>
}
