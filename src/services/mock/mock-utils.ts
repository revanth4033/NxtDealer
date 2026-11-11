import { env } from '@/config/env'
import type { ListParams, PaginatedResponse } from '@/types'

const DEFAULT_PAGE_SIZE = 20

/** Simulates network latency so loading states are exercised during development. */
export function simulateLatency(ms: number = env.mockLatencyMs): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Returns a deep copy so callers can never mutate the in-memory fixtures. */
export function clone<T>(value: T): T {
  return structuredClone(value)
}

/** Applies search, sort and pagination in memory, mirroring what the API will do server-side. */
export function queryCollection<T, TSort extends string>(
  items: readonly T[],
  params: ListParams<TSort> = {},
  options: {
    searchFields: ((item: T) => string)[]
    sortAccessors: Record<TSort, (item: T) => string | number>
  },
): PaginatedResponse<T> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, search, sortBy, sortDirection = 'asc' } = params

  let result = [...items]

  const term = search?.trim().toLowerCase()
  if (term) {
    result = result.filter((item) =>
      options.searchFields.some((field) => field(item).toLowerCase().includes(term)),
    )
  }

  if (sortBy) {
    const accessor = options.sortAccessors[sortBy]
    const direction = sortDirection === 'asc' ? 1 : -1
    result.sort((a, b) => {
      const left = accessor(a)
      const right = accessor(b)
      if (left < right) return -1 * direction
      if (left > right) return 1 * direction
      return 0
    })
  }

  const total = result.length
  const start = (page - 1) * pageSize

  return {
    data: clone(result.slice(start, start + pageSize)),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}
