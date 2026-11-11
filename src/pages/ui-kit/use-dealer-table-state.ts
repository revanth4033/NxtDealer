import type { SortingState } from '@tanstack/react-table'

import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { useUrlState } from '@/hooks/use-url-state'
import type { DealerListParams, DealerPlan, DealerSortField, DealerStatus } from '@/types'

const SORT_FIELDS: DealerSortField[] = ['businessName', 'joinedAt', 'lastActiveAt', 'garageVehicles']
export const PAGE_SIZE_OPTIONS = [5, 10, 20]
const DEFAULT_PAGE_SIZE = 10

const isStatus = (value: string | undefined): value is DealerStatus => !!value && value in DEALER_STATUS
const isPlan = (value: string): value is DealerPlan => value in DEALER_PLAN
const isSortField = (value: string): value is DealerSortField => SORT_FIELDS.includes(value as DealerSortField)

/**
 * URL-backed state for a dealer list: search, status tab, plan filter, sort and pagination.
 * Pattern to reuse for every list page: URL ⇄ typed params ⇄ service query.
 */
export function useDealerTableState() {
  const url = useUrlState()

  const search = url.get('q') ?? ''
  const rawStatus = url.get('status')
  const status = isStatus(rawStatus) ? rawStatus : undefined
  const plans = url.getAll('plan').filter(isPlan)
  const page = url.getNumber('page', 1)
  const requestedSize = url.getNumber('size', DEFAULT_PAGE_SIZE)
  const pageSize = PAGE_SIZE_OPTIONS.includes(requestedSize) ? requestedSize : DEFAULT_PAGE_SIZE

  const [sortField, sortDirection] = (url.get('sort') ?? '').split(':')
  const sorting: SortingState = isSortField(sortField) ? [{ id: sortField, desc: sortDirection === 'desc' }] : []

  // A fresh object per render is fine: TanStack Query hashes query keys structurally.
  const params: DealerListParams = {
    search: search || undefined,
    statuses: status ? [status] : undefined,
    plans: plans.length ? plans : undefined,
    page,
    pageSize,
    sortBy: sorting[0]?.id as DealerSortField | undefined,
    sortDirection: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  }

  const hasFilters = Boolean(search || status || plans.length)

  return {
    params,
    search,
    status,
    plans,
    page,
    pageSize,
    sorting,
    hasFilters,
    // Any change to what's shown resets to page 1.
    setSearch: (next: string) => url.update({ q: next, page: null }),
    setStatus: (next: DealerStatus | undefined) => url.update({ status: next, page: null }),
    setPlans: (next: DealerPlan[]) => url.update({ plan: next, page: null }),
    setSorting: (next: SortingState) =>
      url.update({ sort: next[0] ? `${next[0].id}:${next[0].desc ? 'desc' : 'asc'}` : null, page: null }),
    // Page changes add a history entry so Back returns to the previous page; corrections replace it.
    setPage: (next: number, options: { replace?: boolean } = {}) =>
      url.update({ page: next > 1 ? next : null }, { replace: options.replace ?? false }),
    setPageSize: (next: number) => url.update({ size: next === DEFAULT_PAGE_SIZE ? null : next, page: null }),
    clearFilters: () => url.update({ q: null, status: null, plan: null, page: null }),
  }
}
