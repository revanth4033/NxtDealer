import type { EntityId, ISODateString, ListParams } from './common'

export type AiReelStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface AiReel {
  id: EntityId
  dealerId: EntityId
  dealerName: string
  /** The marketplace listing the reel was generated for, if any. */
  listingId?: EntityId
  title: string
  status: AiReelStatus
  durationSeconds: number
  views: number
  shares: number
  thumbnailUrl?: string
  /** Populated when status is "failed". */
  failureReason?: string
  createdAt: ISODateString
  completedAt?: ISODateString
}

export type AiReelSortField = 'createdAt' | 'views' | 'shares'

export interface AiReelListParams extends ListParams<AiReelSortField> {
  status?: AiReelStatus
  dealerId?: EntityId
}
