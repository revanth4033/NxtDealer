import { ApiError } from '@/services/errors'
import type { DealerService } from '@/services/contracts'
import type { Dealer, DealerSortField } from '@/types'

import { mockDealers } from './mock-inventory'
import { clone, queryCollection, simulateLatency } from './mock-utils'

const sortAccessors: Record<DealerSortField, (dealer: Dealer) => string | number> = {
  businessName: (d) => d.businessName,
  joinedAt: (d) => d.joinedAt,
  lastActiveAt: (d) => d.lastActiveAt,
  garageVehicles: (d) => d.stats.garageVehicles,
  marketplaceVehicles: (d) => d.stats.marketplaceVehicles,
  aiReels: (d) => d.stats.aiReels,
}

export const mockDealerService: DealerService = {
  async list(params = {}) {
    await simulateLatency()
    const filtered = mockDealers.filter(
      (d) =>
        (!params.status || d.status === params.status) &&
        (!params.plans?.length || params.plans.includes(d.plan)),
    )
    return queryCollection(filtered, params, {
      searchFields: [(d) => d.businessName, (d) => d.ownerName, (d) => d.location.city],
      sortAccessors,
    })
  },

  async getById(id) {
    await simulateLatency()
    const dealer = mockDealers.find((d) => d.id === id)
    if (!dealer) throw ApiError.notFound('Dealer', id)
    return clone(dealer)
  },
}
