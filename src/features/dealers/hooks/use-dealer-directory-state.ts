import type { SortingState } from '@tanstack/react-table'

import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { useUrlState } from '@/hooks/use-url-state'
import type { DealerListParams, DealerPlan, DealerSortField, DealerStatus } from '@/types'

export const DIRECTORY_PAGE_SIZES = [10, 20, 50]
const DEFAULT_PAGE_SIZE = 10
/** Alphabetical by dealer name unless the admin picks another column. */
const DEFAULT_SORTING: SortingState = [{ id: 'businessName', desc: false }]

const SORT_FIELDS: readonly DealerSortField[] = [
  'businessName',
  'city',
  'garageVehicles',
  'marketplaceVehicles',
  'aiReels',
  'joinedAt',
]

const isSortField = (value: string): value is DealerSortField => SORT_FIELDS.includes(value as DealerSortField)
const keysOf = <T extends string>(map: Record<T, unknown>) => (value: string): value is T => Object.hasOwn(map, value)
const isStatus = keysOf<DealerStatus>(DEALER_STATUS)
const isPlan = keysOf<DealerPlan>(DEALER_PLAN)

const orUndefined = <T>(values: T[]) => (values.length ? values : undefined)

/**
 * Dealer directory view state, kept in the URL so every filtered view is linkable and survives
 * reloads and Back navigation from a dealer's details page. Unknown values in a hand-edited URL are ignored.
 *
 *   ?q=  ·  status=  ·  plan=  (repeatable)  ·  sort=field:dir  ·  page=  ·  size=
 */
export function useDealerDirectoryState() {
  const url = useUrlState()

  const search = url.get('q') ?? ''
  const statuses = url.getAll('status').filter(isStatus)
  const plans = url.getAll('plan').filter(isPlan)
  const page = url.getNumber('page', 1)
  const requestedSize = url.getNumber('size', DEFAULT_PAGE_SIZE)
  const pageSize = DIRECTORY_PAGE_SIZES.includes(requestedSize) ? requestedSize : DEFAULT_PAGE_SIZE

  const [sortField = '', sortDirection] = (url.get('sort') ?? '').split(':')
  const sorting: SortingState = isSortField(sortField) ? [{ id: sortField, desc: sortDirection === 'desc' }] : DEFAULT_SORTING
  const sort = sorting[0]

  const params: DealerListParams = {
    search: search || undefined,
    statuses: orUndefined(statuses),
    plans: orUndefined(plans),
    page,
    pageSize,
    sortBy: sort.id as DealerSortField,
    sortDirection: sort.desc ? 'desc' : 'asc',
  }

  const hasFilters = Boolean(search || statuses.length || plans.length)

  return {
    params,
    search,
    statuses,
    plans,
    page,
    pageSize,
    sorting,
    hasFilters,
    // Any change to what's shown returns to page 1.
    setSearch: (next: string) => url.update({ q: next, page: null }),
    setStatuses: (next: DealerStatus[]) => url.update({ status: next, page: null }),
    setPlans: (next: DealerPlan[]) => url.update({ plan: next, page: null }),
    // Clearing a sort (third click on a header) falls back to the default alphabetical order.
    setSorting: (next: SortingState) => {
      const [first] = next
      const isDefault = !first || (first.id === DEFAULT_SORTING[0].id && !first.desc)
      url.update({ sort: isDefault ? null : `${first.id}:${first.desc ? 'desc' : 'asc'}`, page: null })
    },
    // Page changes add a history entry so Back returns to the previous page; corrections replace it.
    setPage: (next: number, options: { replace?: boolean } = {}) =>
      url.update({ page: next > 1 ? next : null }, { replace: options.replace ?? false }),
    setPageSize: (next: number) => url.update({ size: next === DEFAULT_PAGE_SIZE ? null : next, page: null }),
    clearFilters: () => url.update({ q: null, status: null, plan: null, page: null }),
  }
}
