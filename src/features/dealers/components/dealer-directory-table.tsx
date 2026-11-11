import { X } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { EmptyState } from '@/components/common/empty-state'
import { FilterDropdown } from '@/components/common/filter-dropdown'
import { Pagination } from '@/components/common/pagination'
import { SearchInput } from '@/components/common/search-input'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { dealerDetailsPath } from '@/config/routes'
import { DEALER_PLAN, DEALER_STATUS, toOptions } from '@/config/status'
import type { Dealer } from '@/types'

import { DIRECTORY_PAGE_SIZES, useDealerDirectoryState } from '../hooks/use-dealer-directory-state'
import { useDealers } from '../hooks/use-dealers'
import { createDealerDirectoryColumns, type DealerDirectoryLinkState } from './dealer-directory-columns'

const EMPTY: Dealer[] = []
const STATUS_OPTIONS = toOptions(DEALER_STATUS)
const PLAN_OPTIONS = toOptions(DEALER_PLAN)

/** Searchable, filterable, sortable directory of every dealer account. Rows open the dealer's details page. */
export function DealerDirectoryTable() {
  const state = useDealerDirectoryState()
  const dealers = useDealers(state.params)
  const navigate = useNavigate()
  const { search: directorySearch } = useLocation()

  const linkState: DealerDirectoryLinkState = useMemo(() => ({ directorySearch }), [directorySearch])
  const columns = useMemo(() => createDealerDirectoryColumns(linkState), [linkState])

  // A stale or hand-edited URL (e.g. ?page=9) snaps back to the last real page.
  const { page, setPage } = state
  const totalPages = dealers.data?.totalPages
  useEffect(() => {
    if (totalPages && page > totalPages) setPage(totalPages, { replace: true })
  }, [page, totalPages, setPage])

  const total = dealers.data?.total ?? 0

  return (
    <DataTable
      label="Dealer directory"
      // Nine data columns: slightly tighter cell padding keeps them on screen at 1440px without scrolling.
      className="[&_td]:px-3 [&_th]:px-3"
      columns={columns}
      data={dealers.data?.data ?? EMPTY}
      getRowId={(dealer) => dealer.id}
      isLoading={dealers.isPending}
      isRefreshing={dealers.isFetching && dealers.isPlaceholderData}
      sorting={state.sorting}
      onSortingChange={state.setSorting}
      onRowClick={(dealer) => navigate(dealerDetailsPath(dealer.id), { state: linkState })}
      skeletonRows={state.pageSize}
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={state.search}
            onValueChange={state.setSearch}
            placeholder="Search dealer, owner or city"
            label="Search dealers by name, owner or city"
            className="sm:w-80"
          />
          <FilterDropdown
            mode="multiple"
            label="Account status"
            options={STATUS_OPTIONS}
            value={state.statuses}
            onValueChange={state.setStatuses}
          />
          <FilterDropdown mode="multiple" label="Plan" options={PLAN_OPTIONS} value={state.plans} onValueChange={state.setPlans} />
          {state.hasFilters && (
            <Button variant="ghost" onClick={state.clearFilters} className="text-foreground-secondary">
              <X /> Clear filters
            </Button>
          )}
        </div>
      }
      emptyState={
        dealers.isError ? (
          <EmptyState
            compact
            variant="error"
            title="Dealers couldn’t be loaded"
            description="The dealer service didn’t respond. Try again in a moment."
            action={
              <Button variant="outline" onClick={() => dealers.refetch()}>
                Try again
              </Button>
            }
          />
        ) : state.hasFilters ? (
          <EmptyState
            compact
            variant="no-results"
            title="No dealers match these filters"
            description="Try a different name, owner or city, or remove a filter."
            action={
              <Button variant="outline" onClick={state.clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            compact
            title="No dealers yet"
            description="Dealers appear here once they register in the NxtDealer app."
          />
        )
      }
      footer={
        <Pagination
          page={state.page}
          pageSize={state.pageSize}
          total={total}
          onPageChange={state.setPage}
          onPageSizeChange={state.setPageSize}
          pageSizeOptions={DIRECTORY_PAGE_SIZES}
          itemLabel={total === 1 ? 'dealer' : 'dealers'}
        />
      }
    />
  )
}
