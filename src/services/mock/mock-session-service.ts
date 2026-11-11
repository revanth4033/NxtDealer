import { mockAdminUser } from '@/mocks/admin-user'
import type { SessionService } from '@/services/contracts'

import { clone, simulateLatency } from './mock-utils'

export const mockSessionService: SessionService = {
  async getCurrentAdmin() {
    await simulateLatency(120)
    return clone(mockAdminUser)
  },
}
