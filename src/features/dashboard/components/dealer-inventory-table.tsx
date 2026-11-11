import type { SortingState } from '@tanstack/react-table'
import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { EntityAvatar } from '@/components/common/entity-avatar'
import { Pagination } from '@/components/common/pagination'
import { SearchInput } from '@/components/common/search-input'
import { StatusBadge } from '@/components/common/status-badge'
import { createDataTableColumnHelper, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { DEALER_STATUS } from '@/config/status'
import { useDealers } from '@/features/dealers/hooks/use-dealers'
import { formatNumber, formatShare } from '@/lib/format'
import type { Dealer, DealerSortField, EntityId } from '@/types'

const PAGE_SIZE = 8
const EMPTY: Dealer[] = []
const column = createDataTableColumnHelper<Dealer>()

function buildColumns(onInspect: (dealerId: EntityId) => void) {
  return column.columns([
    column.accessor('businessName', {
      header: 'Dealer',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onInspect(row.original.id)}
          className="group/dealer -m-1 flex cursor-pointer items-center gap-3 rounded-md p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <EntityAvatar name={row.original.businessName} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-medium text-foreground group-hover/dealer:text-primary">
              {row.original.businessName}
            </span>
            <span className="block truncate text-caption text-muted-foreground">{row.original.location.city}</span>
          </span>
        </button>
      ),
      meta: { className: 'w-[30%] min-w-56' },
    }),
    column.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: ({ getValue }) => <StatusBadge status={DEALER_STATUS[getValue()]} />,
    }),
    column.accessor((dealer) => dealer.stats.garageVehicles, {
      id: 'garageVehicles',
      header: 'Garage',
      cell: ({ getValue }) => <span className="font-medium">{formatNumber(getValue())}</span>,
      meta: { align: 'right' },
    }),
    column.accessor((dealer) => dealer.stats.marketplaceVehicles, {
      id: 'marketplaceVehicles',
      header: 'Published',
      cell: ({ row }) => <PublishedShare stats={row.original.stats} />,
      meta: { align: 'right', className: 'w-44' },
    }),
    column.display({
      id: 'unpublished',
      header: 'Not published',
      cell: ({ row }) => (
        <span className="text-foreground-secondary">
          {formatNumber(row.original.stats.garageVehicles - row.original.stats.marketplaceVehicles)}
        </span>
      ),
      meta: { align: 'right' },
    }),
    column.accessor((dealer) => dealer.stats.aiReels, {
      id: 'aiReels',
      header: 'AI reels',
      cell: ({ getValue }) => <span className="text-foreground-secondary">{formatNumber(getValue())}</span>,
      meta: { align: 'right' },
    }),
    column.display({
      id: 'inspect',
      header: () => <span className="sr-only">Open dealer dashboard</span>,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onInspect(row.original.id)}
          aria-label={`Show dashboard for ${row.original.businessName}`}
        >
          <ArrowRight />
        </Button>
      ),
      meta: { align: 'right', className: 'w-14' },
    }),
  ])
}

/** Published count with its share of the dealer's garage. */
function PublishedShare({ stats }: { stats: Dealer['stats'] }) {
  const percent = stats.garageVehicles === 0 ? 0 : (stats.marketplaceVehicles / stats.garageVehicles) * 100
  return (
    <span className="inline-flex items-center justify-end gap-3">
      <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block" aria-hidden>
        <span className="block h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </span>
      <span className="w-8 font-medium">{formatNumber(stats.marketplaceVehicles)}</span>
      <span className="w-9 text-caption text-muted-foreground">{formatShare(stats.marketplaceVehicles, stats.garageVehicles)}</span>
    </span>
  )
}

/** Dealer-wise garage and marketplace summary for the platform view. */
export function DealerInventoryTable({ onInspectDealer }: { onInspectDealer: (dealerId: EntityId) => void }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'garageVehicles', desc: true }])
  const sort = sorting[0]

  const dealers = useDealers({
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort?.id as DealerSortField | undefined,
    sortDirection: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  })
  const columns = useMemo(() => buildColumns(onInspectDealer), [onInspectDealer])

  return (
    <DataTable
      label="Dealer inventory"
      columns={columns}
      data={dealers.data?.data ?? EMPTY}
      getRowId={(dealer) => dealer.id}
      isLoading={dealers.isPending}
      isRefreshing={dealers.isFetching && dealers.isPlaceholderData}
      sorting={sorting}
      onSortingChange={(next) => {
        setSorting(next)
        setPage(1)
      }}
      skeletonRows={PAGE_SIZE}
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Select a dealer to see their full dashboard.</p>
          <SearchInput
            value={search}
            onValueChange={(next) => {
              setSearch(next)
              setPage(1)
            }}
            placeholder="Search dealers or cities"
            label="Search dealers"
          />
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
        ) : (
          <EmptyState
            compact
            variant="no-results"
            title="No dealers match that search"
            description="Try a dealer name, owner or city."
            action={
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear search
              </Button>
            }
          />
        )
      }
      footer={
        <Pagination page={page} pageSize={PAGE_SIZE} total={dealers.data?.total ?? 0} onPageChange={setPage} itemLabel="dealers" />
      }
    />
  )
}
