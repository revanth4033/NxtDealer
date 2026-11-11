import type { AiReelService } from './ai-reel-service'
import type { AnalyticsService } from './analytics-service'
import type { DealerService } from './dealer-service'
import type { ListingService } from './listing-service'
import type { SessionService } from './session-service'

export type { AiReelService, AnalyticsService, DealerService, ListingService, SessionService }

/**
 * The complete set of data services the UI depends on.
 * Any implementation (mock, HTTP, …) must satisfy this contract.
 */
export interface AppServices {
  dealers: DealerService
  listings: ListingService
  aiReels: AiReelService
  analytics: AnalyticsService
  session: SessionService
}
