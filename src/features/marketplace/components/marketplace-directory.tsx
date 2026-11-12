import { useEffect, useMemo, type ReactNode } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { Pagination } from '@/components/common/pagination'
import { SectionHeader } from '@/components/common/section-header'
import { DataTable } from '@/components/data-table'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { dealerDetailsPath } from '@/config/routes'
import { VehicleCard, VehicleCardSkeleton } from '@/features/garage/components/vehicle-card'
import { cn } from '@/lib/utils'
import type { GarageVehicle, MarketplaceVehicle } from '@/types'

import { useDealerReturnState } from '../hooks/use-dealer-return-state'
import { useMarketplaceFacets } from '../hooks/use-marketplace-insights'
import { MARKETPLACE_PAGE_SIZES, useMarketplaceState } from '../hooks/use-marketplace-state'
import { useMarketplaceVehicles } from '../hooks/use-marketplace-vehicles'
import { createMarketplaceColumns } from './marketplace-columns'
import { MarketplaceToolbar } from './marketplace-toolbar'

const EMPTY: MarketplaceVehicle[] = []
// Three columns at most, like Recently published: full dates leave dealer names room at 1440px.
const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

/**
 * Every published listing, searchable, filterable and sortable, as a table or a grid. Both views
 * read the same URL state and the same query, so they always show the same results in the same order.
 */
export function MarketplaceDirectory({ onSelectVehicle }: { onSelectVehicle: (vehicle: GarageVehicle) => void }) {
  const state = useMarketplaceState()
  const listings = useMarketplaceVehicles(state.params)
  const facets = useMarketplaceFacets(state.filters)
  const returnState = useDealerReturnState()
  const columns = useMemo(() => createMarketplaceColumns(onSelectVehicle, returnState), [onSelectVehicle, returnState])

  // A stale or hand-edited URL (e.g. ?page=9) snaps back to the last real page.
  const { page, setPage } = state
  const totalPages = listings.data?.totalPages
  useEffect(() => {
    if (totalPages && page > totalPages) setPage(totalPages, { replace: true })
  }, [page, totalPages, setPage])

  const vehicles = listings.data?.data ?? EMPTY
  const total = listings.data?.total ?? 0
  const isRefreshing = listings.isFetching && listings.isPlaceholderData

  const toolbar = <MarketplaceToolbar state={state} facets={facets.data} />

  const emptyState = listings.isError ? (
    <EmptyState
      compact
      variant="error"
      title="Listings couldn’t be loaded"
      description="The marketplace service didn’t respond. Try again in a moment."
      action={
        <Button variant="outline" onClick={() => listings.refetch()}>
          Try again
        </Button>
      }
    />
  ) : state.hasFilters ? (
    <EmptyState
      compact
      variant="no-results"
      title="No listings match these filters"
      description="Try a broader search, widen the year or price range, or remove a filter."
      action={
        <Button variant="outline" onClick={state.clearFilters}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState compact title="Nothing published yet" description="Vehicles appear here once dealers publish them from the NxtDealer app." />
  )

  // No records means nothing to page through: the empty state stands alone.
  const footer = total > 0 && (
    <Pagination
      page={state.page}
      pageSize={state.pageSize}
      total={total}
      onPageChange={setPage}
      onPageSizeChange={state.setPageSize}
      pageSizeOptions={MARKETPLACE_PAGE_SIZES}
      itemLabel={total === 1 ? 'listing' : 'listings'}
    />
  )

  return (
    <PageSection labelledBy="marketplace-directory">
      <SectionHeader
        id="marketplace-directory"
        title="All listings"
        description="Every vehicle currently published to the shared marketplace."
      />
      {state.view === 'table' ? (
        <DataTable
          label="Marketplace listings"
          // Nine data columns: slightly tighter cell padding keeps them on screen at 1440px.
          className="[&_td]:px-3 [&_th]:px-3"
          columns={columns}
          data={vehicles}
          getRowId={(vehicle) => vehicle.id}
          isLoading={listings.isPending}
          isRefreshing={isRefreshing}
          sorting={state.sorting}
          onSortingChange={state.setSorting}
          onRowClick={onSelectVehicle}
          skeletonRows={state.pageSize}
          toolbar={toolbar}
          emptyState={emptyState}
          footer={footer}
        />
      ) : (
        <GridSurface toolbar={toolbar} footer={footer}>
          {listings.isPending ? (
            <div className={GRID} aria-busy>
              {Array.from({ length: Math.min(state.pageSize, 12) }, (_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            emptyState
          ) : (
            <ul
              aria-label="Marketplace listings"
              aria-busy={isRefreshing}
              className={cn(GRID, 'transition-opacity duration-150', isRefreshing && 'opacity-60')}
            >
              {vehicles.map((vehicle) => (
                <li key={vehicle.id} className="flex">
                  <VehicleCard
                    vehicle={vehicle}
                    showLocation
                    showStatus
                    publishedDate="date"
                    dealerHref={dealerDetailsPath(vehicle.dealerId)}
                    dealerLinkState={returnState}
                    onSelect={onSelectVehicle}
                  />
                </li>
              ))}
            </ul>
          )}
        </GridSurface>
      )}
    </PageSection>
  )
}

/** The grid's frame: same toolbar and footer placement as DataTable, with cards on the canvas tone. */
function GridSurface({ toolbar, footer, children }: { toolbar: ReactNode; footer: ReactNode; children: ReactNode }) {
  return (
    <div className="surface overflow-hidden">
      <div className="border-b px-5 py-3.5">{toolbar}</div>
      <div className="bg-canvas/60 p-4 sm:p-5">{children}</div>
      {footer && <div className="border-t px-5 py-3">{footer}</div>}
    </div>
  )
}
