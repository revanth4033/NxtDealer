import { mockAiReels } from '@/mocks/ai-reels'
import { mockDealers } from '@/mocks/dealers'
import { mockListings } from '@/mocks/listings'
import type { AnalyticsService } from '@/services/contracts'
import type { MetricSnapshot } from '@/types'

import { simulateLatency } from './mock-utils'

/** Deterministic 12-period series that ends at `current` and reflects `changeRatio`. */
function buildTrend(current: number, changeRatio: number): number[] {
  const start = current / (1 + changeRatio)
  return Array.from({ length: 12 }, (_, i) => {
    const progress = i / 11
    const wobble = Math.sin(i * 1.3) * 0.025 * Math.max(start, current)
    const value = start + (current - start) * progress + (i === 11 ? 0 : wobble)
    return Math.max(0, Math.round(value * 10) / 10)
  })
}

/** Derives dashboard metrics from the fixtures so numbers stay internally consistent. */
export const mockAnalyticsService: AnalyticsService = {
  async getDashboardSummary() {
    await simulateLatency()
    const metrics: Omit<MetricSnapshot, 'trend'>[] = [
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
    ]
    return {
      generatedAt: new Date().toISOString(),
      metrics: metrics.map((metric) => ({ ...metric, trend: buildTrend(metric.value, metric.changeRatio) })),
    }
  },
}
