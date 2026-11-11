import { mockAiReels } from '@/mocks/ai-reels'
import { mockDealers } from '@/mocks/dealers'
import { mockListings } from '@/mocks/listings'
import type { AnalyticsService } from '@/services/contracts'

import { simulateLatency } from './mock-utils'

/** Derives dashboard metrics from the fixtures so numbers stay internally consistent. */
export const mockAnalyticsService: AnalyticsService = {
  async getDashboardSummary() {
    await simulateLatency()
    return {
      generatedAt: new Date().toISOString(),
      metrics: [
        { key: 'totalDealers', label: 'Total dealers', value: mockDealers.length, format: 'number', changeRatio: 0.083 },
        {
          key: 'activeDealers',
          label: 'Active dealers',
          value: mockDealers.filter((d) => d.status === 'active').length,
          format: 'number',
          changeRatio: 0.041,
        },
        {
          key: 'liveListings',
          label: 'Live listings',
          value: mockListings.filter((l) => l.status === 'live').length,
          format: 'number',
          changeRatio: 0.126,
        },
        {
          key: 'reelsGenerated',
          label: 'AI reels generated',
          value: mockAiReels.filter((r) => r.status === 'completed').length,
          format: 'number',
          changeRatio: 0.214,
        },
        {
          key: 'marketplaceLeads',
          label: 'Marketplace leads',
          value: mockListings.reduce((sum, l) => sum + l.leads, 0),
          format: 'number',
          changeRatio: -0.032,
        },
      ],
    }
  },
}
