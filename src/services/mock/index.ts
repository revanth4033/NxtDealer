import type { AppServices } from '@/services/contracts'

import { mockAiReelService } from './mock-ai-reel-service'
import { mockAnalyticsService } from './mock-analytics-service'
import { mockDealerService } from './mock-dealer-service'
import { mockGarageService } from './mock-garage-service'
import { mockMarketplaceService } from './mock-marketplace-service'
import { mockSessionService } from './mock-session-service'

export const mockServices: AppServices = {
  dealers: mockDealerService,
  garage: mockGarageService,
  marketplace: mockMarketplaceService,
  aiReels: mockAiReelService,
  analytics: mockAnalyticsService,
  session: mockSessionService,
}
