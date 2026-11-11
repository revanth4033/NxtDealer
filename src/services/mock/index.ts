import type { AppServices } from '@/services/contracts'

import { mockAiReelService } from './mock-ai-reel-service'
import { mockAnalyticsService } from './mock-analytics-service'
import { mockDealerService } from './mock-dealer-service'
import { mockListingService } from './mock-listing-service'
import { mockSessionService } from './mock-session-service'

export const mockServices: AppServices = {
  dealers: mockDealerService,
  listings: mockListingService,
  aiReels: mockAiReelService,
  analytics: mockAnalyticsService,
  session: mockSessionService,
}
