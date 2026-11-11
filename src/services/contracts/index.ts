import type { AiReelService } from './ai-reel-service'
import type { AnalyticsService } from './analytics-service'
import type { DealerService } from './dealer-service'
import type { GarageService } from './garage-service'
import type { MarketplaceService } from './marketplace-service'
import type { SessionService } from './session-service'

export type { AiReelService, AnalyticsService, DealerService, GarageService, MarketplaceService, SessionService }

/**
 * The complete set of data services the UI depends on.
 * Any implementation (mock, HTTP, …) must satisfy this contract.
 * Every service is read-only: the admin portal monitors, it never mutates dealer data.
 */
export interface AppServices {
  dealers: DealerService
  garage: GarageService
  marketplace: MarketplaceService
  aiReels: AiReelService
  analytics: AnalyticsService
  session: SessionService
}
