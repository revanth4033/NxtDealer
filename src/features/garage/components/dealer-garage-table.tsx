import type { SortingState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { Pagination } from '@/components/common/pagination'
import { SearchInput } from '@/components/common/search-input'
import { StatusBadge } from '@/components/common/status-badge'
import { createDataTableColumnHelper, DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MARKETPLACE_STATUS } from '@/config/status'
import { formatDate, formatKm, formatNumber, formatPriceShort } from '@/lib/format'
import type { Dealer, GarageSortField, GarageVehicle, InventoryTotals, MarketplaceStatus } from '@/types'

import { useGarageVehicles } from '../hooks/use-garage-vehicles'
import { FUEL_LABELS, TRANSMISSION_LABELS } from '../vehicle-labels'
import { VehicleImage } from './vehicle-image'

const PAGE_SIZE = 8
const EMPTY: GarageVehicle[] = []
const column = createDataTableColumnHelper<GarageVehicle>()

type StatusFilter = MarketplaceStatus | 'all'

function buildColumns(onSelect: (vehicle: GarageVehicle) => void) {
  return column.columns([
    column.accessor('title', {
      header: 'Vehicle',
      enableSorting: false,
      cell: ({ row }) => {
        const vehicle = row.original
        return (
          <button
            type="button"
            onClick={() => onSelect(vehicle)}
            className="group/vehicle -m-1 flex cursor-pointer items-center gap-3 rounded-md p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <VehicleImage src={vehicle.photos[0]} alt={vehicle.title} compact className="h-10 w-14 shrink-0 rounded-md border" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-medium text-foreground group-hover/vehicle:text-primary">
                {vehicle.specs.make} {vehicle.specs.model}
              </span>
              <span className="block truncate text-caption text-muted-foreground">
                {vehicle.specs.variant}, {vehicle.specs.colour}
              </span>
            </span>
          </button>
        )
      },
      meta: { className: 'w-[30%] min-w-64' },
    }),
    column.accessor((vehicle) => vehicle.specs.year, {
      id: 'year',
      header: 'Year',
      cell: ({ getValue }) => getValue(),
    }),
    column.display({
      id: 'specs',
      header: 'Fuel and gearbox',
      cell: ({ row }) => (
        <span className="text-foreground-secondary">
          {FUEL_LABELS[row.original.specs.fuelType]}, {TRANSMISSION_LABELS[row.original.specs.transmission].toLowerCase()}
        </span>
      ),
    }),
    column.display({
      id: 'odometer',
      header: 'Odometer',
      cell: ({ row }) => <span className="text-foreground-secondary">{formatKm(row.original.specs.odometerKm)}</span>,
      meta: { align: 'right' },
    }),
    column.accessor((vehicle) => vehicle.price.amount, {
      id: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="font-medium">{formatPriceShort(row.original.price)}</span>,
      meta: { align: 'right' },
    }),
    column.display({
      id: 'marketplace',
      header: 'Marketplace',
      cell: ({ row }) => <StatusBadge status={MARKETPLACE_STATUS[row.original.marketplace.status]} />,
    }),
    column.display({
      id: 'reels',
      header: 'AI reels',
      cell: ({ row }) => (
        <span className={row.original.aiReelCount ? 'font-medium' : 'text-muted-foreground'}>
          {row.original.aiReelCount || '–'}
        </span>
      ),
      meta: { align: 'right' },
    }),
    column.accessor('addedAt', {
      header: 'Added',
      cell: ({ getValue }) => <span className="text-foreground-secondary">{formatDate(getValue())}</span>,
    }),
  ])
}

interface DealerGarageTableProps {
  dealer: Dealer
  /** Counts for the status tabs, from the dashboard summary. */
  totals: InventoryTotals | undefined
  onSelectVehicle: (vehicle: GarageVehicle) => void
}

/** One dealer's complete garage, published and unpublished. Used on the dashboard and the dealer details page. */
export function DealerGarageTable({ dealer, totals, onSelectVehicle }: DealerGarageTableProps) {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'addedAt', desc: true }])
  const sort = sorting[0]

  const vehicles = useGarageVehicles({
    dealerId: dealer.id,
    marketplaceStatus: status === 'all' ? undefined : status,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy: sort?.id as GarageSortField | undefined,
    sortDirection: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  })
  const columns = useMemo(() => buildColumns(onSelectVehicle), [onSelectVehicle])
  const total = vehicles.data?.total ?? 0

  // `shortLabel` keeps all three tabs visible on phones.
  const tabs: { value: StatusFilter; label: string; shortLabel?: string; count?: number }[] = [
    { value: 'all', label: 'All vehicles', shortLabel: 'All', count: totals?.garageVehicles },
    { value: 'published', label: 'Published', count: totals?.marketplaceVehicles },
    { value: 'unpublished', label: 'Not published', count: totals?.unpublishedVehicles },
  ]
  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  return (
    <DataTable
      label={`${dealer.businessName} garage`}
      columns={columns}
      data={vehicles.data?.data ?? EMPTY}
      getRowId={(vehicle) => vehicle.id}
      isLoading={vehicles.isPending}
      isRefreshing={vehicles.isFetching && vehicles.isPlaceholderData}
      sorting={sorting}
      onSortingChange={resetPage(setSorting)}
      onRowClick={onSelectVehicle}
      skeletonRows={PAGE_SIZE}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={status} onValueChange={(value) => resetPage(setStatus)(value as StatusFilter)}>
            <TabsList variant="segment" aria-label="Filter by marketplace status">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                  {tab.shortLabel ? (
                    <>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </>
                  ) : (
                    tab.label
                  )}
                  {tab.count !== undefined && (
                    <span className="text-caption text-muted-foreground tabular-nums">{formatNumber(tab.count)}</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <SearchInput value={search} onValueChange={resetPage(setSearch)} placeholder="Search make, model or colour" label="Search garage" />
        </div>
      }
      emptyState={
        vehicles.isError ? (
          <EmptyState
            compact
            variant="error"
            title="Garage couldn’t be loaded"
            description="The garage service didn’t respond. Try again in a moment."
            action={
              <Button variant="outline" onClick={() => vehicles.refetch()}>
                Try again
              </Button>
            }
          />
        ) : dealer.stats.garageVehicles === 0 ? (
          <EmptyState compact title="Garage is empty" description={`${dealer.businessName} hasn’t added any vehicles in the app yet.`} />
        ) : search ? (
          <EmptyState
            compact
            variant="no-results"
            title="No vehicles match that search"
            description="Try a make, model or colour."
            action={
              <Button variant="outline" onClick={() => resetPage(setSearch)('')}>
                Clear search
              </Button>
            }
          />
        ) : (
          <EmptyState
            compact
            title={status === 'published' ? 'No published vehicles' : 'Every vehicle is published'}
            description={
              status === 'published'
                ? `None of ${dealer.businessName}’s garage vehicles are on the marketplace.`
                : `All of ${dealer.businessName}’s garage vehicles are on the marketplace.`
            }
          />
        )
      }
      // No records means nothing to page through: the empty state stands alone.
      footer={
        total > 0 && <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} itemLabel="vehicles" />
      }
    />
  )
}
