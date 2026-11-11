import type { EntityId, GarageListParams, GarageVehicle, PaginatedResponse } from '@/types'

/** Dealer garage inventory: every vehicle, published or not. Read-only for admins. */
export interface GarageService {
  list(params?: GarageListParams): Promise<PaginatedResponse<GarageVehicle>>
  getById(id: EntityId): Promise<GarageVehicle>
}
