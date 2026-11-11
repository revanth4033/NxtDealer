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
}

export interface TimeSeriesPoint {
  date: ISODateString
  value: number
}

export interface DashboardSummary {
  generatedAt: ISODateString
  metrics: MetricSnapshot[]
}
