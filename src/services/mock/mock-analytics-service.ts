import { mockAiReels, mockVehicles } from '@/mocks/vehicles'
import { ApiError } from '@/services/errors'
import type { AnalyticsService } from '@/services/contracts'
import type { DealerStatus } from '@/types'

import { computeTotals, mockDealers } from './mock-inventory'
import { simulateLatency } from './mock-utils'

/** Totals are always computed from records — marketplace vehicles are a subset of garage vehicles, never added to them. */
export const mockAnalyticsService: AnalyticsService = {
  async getDashboardSummary({ dealerId } = {}) {
    await simulateLatency()
    const generatedAt = new Date().toISOString()

    if (dealerId) {
      if (!mockDealers.some((dealer) => dealer.id === dealerId)) throw ApiError.notFound('Dealer', dealerId)
      const vehicles = mockVehicles.filter((vehicle) => vehicle.dealerId === dealerId)
      const reelVehicleIds = mockAiReels.filter((reel) => reel.dealerId === dealerId).map((reel) => reel.vehicleId)
      return { scope: { type: 'dealer', dealerId }, totals: computeTotals(vehicles, reelVehicleIds), generatedAt }
    }

    const byStatus: Record<DealerStatus, number> = { active: 0, pending: 0, suspended: 0, inactive: 0 }
    mockDealers.forEach((dealer) => byStatus[dealer.status]++)

    return {
      scope: { type: 'platform' },
      totals: computeTotals(mockVehicles, mockAiReels.map((reel) => reel.vehicleId)),
      dealers: {
        total: mockDealers.length,
        byStatus,
        withGarageVehicles: mockDealers.filter((dealer) => dealer.stats.garageVehicles > 0).length,
        withMarketplaceVehicles: mockDealers.filter((dealer) => dealer.stats.marketplaceVehicles > 0).length,
      },
      generatedAt,
    }
  },
}
