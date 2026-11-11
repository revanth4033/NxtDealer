import { mockAiReels } from '@/mocks/vehicles'
import { ApiError } from '@/services/errors'
import type { AiReelService } from '@/services/contracts'
import type { AiReel, AiReelSortField } from '@/types'

import { clone, queryCollection, simulateLatency } from './mock-utils'

const sortAccessors: Record<AiReelSortField, (reel: AiReel) => string | number> = {
  createdAt: (r) => r.createdAt,
}

export const mockAiReelService: AiReelService = {
  async list(params = {}) {
    await simulateLatency()
    const filtered = mockAiReels.filter(
      (r) => (!params.dealerId || r.dealerId === params.dealerId) && (!params.vehicleId || r.vehicleId === params.vehicleId),
    )
    return queryCollection(filtered, { ...params, sortBy: params.sortBy ?? 'createdAt', sortDirection: params.sortDirection ?? 'desc' }, {
      searchFields: [(r) => r.vehicleTitle, (r) => r.dealerName],
      sortAccessors,
    })
  },

  async getById(id) {
    await simulateLatency(200)
    const reel = mockAiReels.find((r) => r.id === id)
    if (!reel) throw ApiError.notFound('AI reel', id)
    return clone(reel)
  },
}
