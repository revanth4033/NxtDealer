/** Shared primitives used across all domain entities. */

/** Opaque string identifier. Backend IDs are treated as strings regardless of storage type. */
export type EntityId = string

/** ISO-8601 timestamp string, e.g. "2026-11-11T09:30:00.000Z". */
export type ISODateString = string

export type CurrencyCode = 'INR'

export interface Money {
  amount: number
  currency: CurrencyCode
}

export type SortDirection = 'asc' | 'desc'

/** Standard query parameters accepted by list endpoints. */
export interface ListParams<TSortField extends string = string> {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: TSortField
  sortDirection?: SortDirection
}

/** Standard envelope returned by paginated list endpoints. */
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/** Normalised error shape surfaced to the UI by every service implementation. */
export interface ApiErrorShape {
  status: number
  code: string
  message: string
}
