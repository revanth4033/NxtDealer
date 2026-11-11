import type { EntityId, Showroom } from '@/types'

export interface ShowroomService {
  /** Every showroom registered under a dealer, in registration order. Empty when the dealer has none. */
  listByDealer(dealerId: EntityId): Promise<Showroom[]>
}
