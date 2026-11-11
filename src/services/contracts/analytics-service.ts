import type { DashboardSummary } from '@/types'

export interface AnalyticsService {
  getDashboardSummary(): Promise<DashboardSummary>
}
