import { ApiError } from '@/services/errors'
import type { DealerService } from '@/services/contracts'
import type { Dealer, DealerSortField } from '@/types'

import { mockDealers } from './mock-inventory'
import { clone, queryCollection, simulateLatency } from './mock-utils'

const sortAccessors: Record<DealerSortField, (dealer: Dealer) => string | number> = {
  businessName: (d) => d.businessName.toLowerCase(),
  city: (d) => d.location.city.toLowerCase(),
  joinedAt: (d) => d.joinedAt,
  lastActiveAt: (d) => d.lastActiveAt,
  garageVehicles: (d) => d.stats.garageVehicles,
  marketplaceVehicles: (d) => d.stats.marketplaceVehicles,
  aiReels: (d) => d.stats.aiReels,
}

export const mockDealerService: DealerService = {
  async list(params = {}) {
    await simulateLatency()
    const matches = <T>(selected: T[] | undefined, value: T) => !selected?.length || selected.includes(value)
    const filtered = mockDealers.filter(
      (d) =>
        matches(params.statuses, d.status) &&
        matches(params.plans, d.plan),
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
