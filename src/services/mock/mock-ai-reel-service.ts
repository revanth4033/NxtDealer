import { mockAiReels } from '@/mocks/ai-reels'
import { ApiError } from '@/services/errors'
import type { AiReelService } from '@/services/contracts'
import type { AiReel, AiReelSortField } from '@/types'

import { clone, queryCollection, simulateLatency } from './mock-utils'

const sortAccessors: Record<AiReelSortField, (reel: AiReel) => string | number> = {
  createdAt: (r) => r.createdAt,
  views: (r) => r.views,
  shares: (r) => r.shares,
}

export const mockAiReelService: AiReelService = {
  async list(params = {}) {
    await simulateLatency()
    const filtered = mockAiReels.filter(
      (r) => (!params.status || r.status === params.status) && (!params.dealerId || r.dealerId === params.dealerId),
    )
    return queryCollection(filtered, params, {
      searchFields: [(r) => r.title, (r) => r.dealerName],
      sortAccessors,
    })
  },

  async getById(id) {
    await simulateLatency()
    const reel = mockAiReels.find((r) => r.id === id)
    if (!reel) throw ApiError.notFound('AI reel', id)
    return clone(reel)
  },
}
