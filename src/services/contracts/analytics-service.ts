import type { DashboardSummary, DashboardSummaryParams } from '@/types'

export interface AnalyticsService {
  /** Platform-wide totals, or one dealer's totals when `dealerId` is given. */
  getDashboardSummary(params?: DashboardSummaryParams): Promise<DashboardSummary>
}
