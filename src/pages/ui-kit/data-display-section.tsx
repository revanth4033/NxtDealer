import { CheckCircle2, Store, Users } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { FilterDropdown } from '@/components/common/filter-dropdown'
import { Pagination } from '@/components/common/pagination'
import { SearchInput } from '@/components/common/search-input'
import { SectionHeader } from '@/components/common/section-header'
import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { DataTable } from '@/components/data-table'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEALER_PLAN, DEALER_STATUS, toOptions } from '@/config/status'
import { useDealers } from '@/features/dealers/hooks/use-dealers'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { formatNumber } from '@/lib/format'
import type { DealerStatus } from '@/types'

import { createDealerColumns } from './dealer-demo-columns'
import { PAGE_SIZE_OPTIONS, useDealerTableState } from './use-dealer-table-state'

const EMPTY: never[] = []

const STATUS_TABS: { value: DealerStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  ...toOptions(DEALER_STATUS),
]

export function DataDisplaySection() {
  return (
    <div className="flex flex-col gap-10">
      <StatCardsDemo />
      <DataTableDemo />
    </div>
  )
}

function StatCardsDemo() {
  return (
    <PageSection labelledBy="kit-stat-cards">
      <SectionHeader
        id="kit-stat-cards"
        title="Stat cards"
        description="Headline figure with one line of context from real data. Use the meter only for a genuine part-of-whole."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Plain" value={formatNumber(26)} icon={Users} />
        <StatCard label="With context" value={formatNumber(312)} icon={Store} context="Across 25 dealer garages" />
        <StatCard
          label="With meter"
          value={formatNumber(141)}
          icon={CheckCircle2}
          context="Of 312 garage vehicles"
          meter={{ value: 141, max: 312, label: '45% published' }}
        />
        <StatCardSkeleton />
      </div>
    </PageSection>
  )
}

function DataTableDemo() {
  const state = useDealerTableState()
  const dealers = useDealers(state.params)
  const { copy, message } = useCopyToClipboard()
  const columns = useMemo(() => createDealerColumns(copy), [copy])
  const totalPages = dealers.data?.totalPages

  // A stale or hand-edited URL (e.g. ?page=99) snaps back to the last real page.
  const { page, setPage } = state
  useEffect(() => {
    if (totalPages && page > totalPages) setPage(totalPages, { replace: true })
  }, [page, totalPages, setPage])

  return (
    <PageSection labelledBy="kit-data-table">
      <SectionHeader
        id="kit-data-table"
        title="Data table"
        description="Search, status tabs, plan filter, sorting and pagination — all stored in the URL and resolved by the dealer mock service."
        actions={
          <span role="status" aria-live="polite" className="text-caption font-medium text-success">
            {message}
          </span>
        }
      />
      <DataTable
        label="Dealers"
        columns={columns}
        data={dealers.data?.data ?? EMPTY}
        getRowId={(dealer) => dealer.id}
        isLoading={dealers.isPending}
        isRefreshing={dealers.isFetching && dealers.isPlaceholderData}
        sorting={state.sorting}
        onSortingChange={state.setSorting}
        skeletonRows={state.pageSize}
        toolbar={
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Tabs
              value={state.status ?? 'all'}
              onValueChange={(value) => state.setStatus(value === 'all' ? undefined : (value as DealerStatus))}
            >
              <TabsList variant="segment" aria-label="Filter by status">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                value={state.search}
                onValueChange={state.setSearch}
                placeholder="Search dealers, owners, cities"
                label="Search dealers"
              />
              <FilterDropdown
                mode="multiple"
                label="Plan"
                options={toOptions(DEALER_PLAN)}
                value={state.plans}
                onValueChange={state.setPlans}
                align="end"
              />
            </div>
          </div>
        }
        emptyState={
          dealers.isError ? (
            <EmptyState
              compact
              variant="error"
              title="Dealers couldn’t be loaded"
              description="The dealer service didn’t respond. Check your connection and try again."
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
              description="Try a different search term, or clear filters to see every dealer."
              action={
                <Button variant="outline" onClick={state.clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState compact title="No dealers yet" description="Dealers appear here once they sign up in the NxtDealer app." />
          )
        }
        footer={
          <Pagination
            page={state.page}
            pageSize={state.pageSize}
            total={dealers.data?.total ?? 0}
            onPageChange={(next) => state.setPage(next)}
            onPageSizeChange={state.setPageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            itemLabel="dealers"
          />
        }
      />
    </PageSection>
  )
}

