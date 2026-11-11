import { mockVehicles } from '@/mocks/vehicles'
import { ApiError } from '@/services/errors'
import type { GarageService } from '@/services/contracts'
import type { GarageSortField, GarageVehicle } from '@/types'

import { clone, queryCollection, simulateLatency } from './mock-utils'

export const vehicleSearchFields = [
  (v: GarageVehicle) => v.title,
  (v: GarageVehicle) => v.dealerName,
  (v: GarageVehicle) => v.city,
  (v: GarageVehicle) => v.specs.colour,
]

const sortAccessors: Record<GarageSortField, (vehicle: GarageVehicle) => string | number> = {
  addedAt: (v) => v.addedAt,
  price: (v) => v.price.amount,
  year: (v) => v.specs.year,
}

export const mockGarageService: GarageService = {
  async list(params = {}) {
    await simulateLatency()
    const filtered = mockVehicles.filter(
      (v) =>
        (!params.dealerId || v.dealerId === params.dealerId) &&
        (!params.marketplaceStatus || v.marketplace.status === params.marketplaceStatus),
    )
    return queryCollection(filtered, { ...params, sortBy: params.sortBy ?? 'addedAt', sortDirection: params.sortDirection ?? 'desc' }, {
      searchFields: vehicleSearchFields,
      sortAccessors,
    })
  },

  async getById(id) {
    await simulateLatency(200)
    const vehicle = mockVehicles.find((v) => v.id === id)
    if (!vehicle) throw ApiError.notFound('Vehicle', id)
    return clone(vehicle)
  },
}
