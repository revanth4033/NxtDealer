import type { EntityId, ISODateString, ListParams } from './common'

/**
 * A promotional video a dealer generated from a vehicle's photos.
 * One vehicle can have many reels, so reel counts are content counts — not vehicle counts.
 */
export interface AiReel {
  id: EntityId
  dealerId: EntityId
  dealerName: string
  vehicleId: EntityId
  /** Denormalised vehicle name for display, e.g. "2022 Hyundai Creta SX(O)". */
  vehicleTitle: string
  durationSeconds: number
  /** Poster frame. */
  thumbnailUrl: string
  videoUrl: string
  createdAt: ISODateString
}

export type AiReelSortField = 'createdAt'

export interface AiReelListParams extends ListParams<AiReelSortField> {
  dealerId?: EntityId
  vehicleId?: EntityId
}
