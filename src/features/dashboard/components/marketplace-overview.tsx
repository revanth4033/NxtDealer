import { EmptyState } from '@/components/common/empty-state'
import { SectionHeader } from '@/components/common/section-header'
import { SectionLink } from '@/components/common/section-link'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
import { VehicleCard, VehicleCardSkeleton } from '@/features/garage/components/vehicle-card'
import { useMarketplaceVehicles } from '@/features/marketplace/hooks/use-marketplace-vehicles'
import { formatNumber } from '@/lib/format'
import type { Dealer, GarageVehicle } from '@/types'

const PREVIEW_COUNT = 8

interface MarketplaceOverviewProps {
  dealer: Dealer | undefined
  onSelectVehicle: (vehicle: GarageVehicle) => void
}

/** Latest vehicles on the shared marketplace — platform-wide or for one dealer. */
export function MarketplaceOverview({ dealer, onSelectVehicle }: MarketplaceOverviewProps) {
  const listings = useMarketplaceVehicles({ dealerId: dealer?.id, pageSize: PREVIEW_COUNT })
  const total = listings.data?.total ?? 0
  const vehicles = listings.data?.data ?? []

  return (
    <PageSection labelledBy="dashboard-marketplace">
      <SectionHeader
        id="dashboard-marketplace"
        title={dealer ? 'Published to the marketplace' : 'Marketplace'}
        description={
          dealer
            ? `Vehicles from ${dealer.businessName}’s garage that every NxtDealer dealer can discover.`
            : 'Latest vehicles dealers have published to the shared marketplace.'
        }
        actions={
          <>
            {total > 0 && (
              <span className="text-caption text-muted-foreground tabular-nums">
                {formatNumber(vehicles.length)} of {formatNumber(total)} shown
              </span>
            )}
            <SectionLink to={ROUTES.marketplace}>Open marketplace</SectionLink>
          </>
        }
      />

      {listings.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.isError ? (
        <div className="surface">
          <EmptyState
            compact
            variant="error"
            title="Marketplace vehicles couldn’t be loaded"
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
          <EmptyState
            compact
            title="Nothing published to the marketplace"
            description={
              dealer
                ? dealer.stats.garageVehicles > 0
                  ? `${dealer.businessName} has ${formatNumber(dealer.stats.garageVehicles)} garage vehicles but hasn’t published any of them.`
                  : `${dealer.businessName} hasn’t added any vehicles to their garage yet.`
                : 'No dealer has published a vehicle yet.'
            }
          />
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="flex">
              <VehicleCard vehicle={vehicle} showDealer={!dealer} onSelect={onSelectVehicle} />
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  )
}
