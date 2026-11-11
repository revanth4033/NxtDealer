import type { EntityId } from './common'

/** A showroom's own account status, independent of its dealer's account status. */
export type ShowroomStatus = 'active' | 'suspended'

/**
 * A physical showroom registered under a dealer account in the NxtDealer app.
 * A dealer can have none, one, or several (in different locations within the dealer's city).
 */
export interface Showroom {
  id: EntityId
  dealerId: EntityId
  name: string
  contactNumber: string
  city: string
  /** Street address including locality and PIN code. */
  address: string
  status: ShowroomStatus
}
