import { mockVehicles } from '@/mocks/vehicles'
import type { MarketplaceService } from '@/services/contracts'
import type { GarageVehicle, MarketplaceSortField, MarketplaceVehicle } from '@/types'

import { vehicleSearchFields } from './mock-garage-service'
import { queryCollection, simulateLatency } from './mock-utils'

const isPublished = (vehicle: GarageVehicle): vehicle is MarketplaceVehicle => vehicle.marketplace.status === 'published'

const sortAccessors: Record<MarketplaceSortField, (vehicle: MarketplaceVehicle) => string | number> = {
  publishedAt: (v) => v.marketplace.publishedAt,
  price: (v) => v.price.amount,
  year: (v) => v.specs.year,
}

export const mockMarketplaceService: MarketplaceService = {
  async list(params = {}) {
    await simulateLatency()
    // The marketplace is a view over garage vehicles — never a separate inventory.
    const published = mockVehicles.filter(isPublished).filter((v) => !params.dealerId || v.dealerId === params.dealerId)
    return queryCollection(published, { ...params, sortBy: params.sortBy ?? 'publishedAt', sortDirection: params.sortDirection ?? 'desc' }, {
      searchFields: vehicleSearchFields,
      sortAccessors,
    })
  },
}
