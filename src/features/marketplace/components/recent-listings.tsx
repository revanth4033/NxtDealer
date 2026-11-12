import { EmptyState } from '@/components/common/empty-state'
import { SectionHeader } from '@/components/common/section-header'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { dealerDetailsPath } from '@/config/routes'
import { VehicleCard, VehicleCardSkeleton } from '@/features/garage/components/vehicle-card'
import type { GarageVehicle } from '@/types'

import { useDealerReturnState } from '../hooks/use-dealer-return-state'
import { useMarketplaceVehicles } from '../hooks/use-marketplace-vehicles'

const RECENT_COUNT = 6
const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

/** The six most recently published listings, newest first, with their publication dates. */
export function RecentListings({ onSelectVehicle }: { onSelectVehicle: (vehicle: GarageVehicle) => void }) {
  // The marketplace service sorts newest first by default.
  const listings = useMarketplaceVehicles({ pageSize: RECENT_COUNT, sortBy: 'publishedAt', sortDirection: 'desc' })
  const vehicles = listings.data?.data ?? []
  const returnState = useDealerReturnState()

  return (
    <PageSection labelledBy="marketplace-recent">
      <SectionHeader
        id="marketplace-recent"
        title="Recently published"
        description="The latest vehicles dealers have published, newest first."
      />
      {listings.isPending ? (
        <div className={GRID} aria-busy>
          {Array.from({ length: RECENT_COUNT }, (_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.isError ? (
        <div className="surface">
          <EmptyState
            compact
            variant="error"
            title="Recent listings couldn’t be loaded"
            description="The marketplace service didn’t respond. Try again in a moment."
            action={
              <Button variant="outline" onClick={() => listings.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="surface">
          <EmptyState compact title="Nothing published yet" description="Vehicles appear here once dealers publish them from the NxtDealer app." />
        </div>
      ) : (
        <ul className={GRID}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="flex">
              <VehicleCard
                vehicle={vehicle}
                showLocation
                publishedDate="date"
                dealerHref={dealerDetailsPath(vehicle.dealerId)}
                dealerLinkState={returnState}
                onSelect={onSelectVehicle}
              />
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  )
}
