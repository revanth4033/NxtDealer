import type { AiReel, AiReelListParams, EntityId, PaginatedResponse } from '@/types'

export interface AiReelService {
  list(params?: AiReelListParams): Promise<PaginatedResponse<AiReel>>
  getById(id: EntityId): Promise<AiReel>
}
