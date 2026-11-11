import type { ISODateString } from './common'

export type MetricKey =
  | 'totalDealers'
  | 'activeDealers'
  | 'liveListings'
  | 'reelsGenerated'
  | 'marketplaceLeads'

export type MetricFormat = 'number' | 'currency' | 'percent'

export interface MetricSnapshot {
  key: MetricKey
  label: string
  value: number
  format: MetricFormat
  /** Fractional change versus the previous period, e.g. 0.124 = +12.4%. */
  changeRatio: number
  /** Whether an increase is good (most metrics) or bad (e.g. failed reels). Defaults to "higher". */
  betterWhen?: 'higher' | 'lower'
  /** Recent values, oldest first, for sparklines. */
  trend?: number[]
}

export interface TimeSeriesPoint {
  date: ISODateString
  value: number
}

export interface DashboardSummary {
  generatedAt: ISODateString
  metrics: MetricSnapshot[]
}
