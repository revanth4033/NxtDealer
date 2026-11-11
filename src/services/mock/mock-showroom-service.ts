import { mockShowrooms } from '@/mocks/showrooms'
import { ApiError } from '@/services/errors'
import type { ShowroomService } from '@/services/contracts'

import { mockDealers } from './mock-inventory'
import { clone, simulateLatency } from './mock-utils'

export const mockShowroomService: ShowroomService = {
  async listByDealer(dealerId) {
    await simulateLatency()
    if (!mockDealers.some((dealer) => dealer.id === dealerId)) throw ApiError.notFound('Dealer', dealerId)
    return clone(mockShowrooms.filter((showroom) => showroom.dealerId === dealerId))
  },
}
