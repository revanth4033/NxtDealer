import { useState } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { VehicleCard, VehicleCardSkeleton } from '@/features/garage/components/vehicle-card'
import { formatNumber } from '@/lib/format'
import type { Dealer, GarageVehicle } from '@/types'

import { useMarketplaceVehicles } from '../hooks/use-marketplace-vehicles'

const BATCH = 8
const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

interface DealerMarketplaceListingsProps {
  dealer: Dealer
  onSelectVehicle: (vehicle: GarageVehicle) => void
}

/**
 * A dealer's vehicles currently on the shared marketplace, newest first. Listings are the dealer's
 * garage vehicles (no separate records) and are attributed to the dealer and city — the app doesn't
 * assign vehicles to showrooms yet.
 */
export function DealerMarketplaceListings({ dealer, onSelectVehicle }: DealerMarketplaceListingsProps) {
  const [visible, setVisible] = useState(BATCH)
  const listings = useMarketplaceVehicles({ dealerId: dealer.id, pageSize: visible })
  const vehicles = listings.data?.data ?? []
  const total = listings.data?.total ?? 0

  if (listings.isPending) {
    return (
      <div className={GRID} aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (listings.isError) {
    return (
      <div className="surface">
        <EmptyState
          compact
          variant="error"
          title="Marketplace listings couldn’t be loaded"
          description="The marketplace service didn’t respond. Try again in a moment."
          action={
            <Button variant="outline" onClick={() => listings.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="surface">
        <EmptyState
          compact
          title="Nothing published to the marketplace"
          description={
            dealer.stats.garageVehicles > 0
              ? `${dealer.businessName} has ${formatNumber(dealer.stats.garageVehicles)} garage vehicles but none are published right now.`
              : `${dealer.businessName} hasn’t added any vehicles to their garage yet.`
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className={GRID}>
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="flex">
            <VehicleCard vehicle={vehicle} showLocation showStatus onSelect={onSelectVehicle} />
          </li>
        ))}
      </ul>
      {vehicles.length < total && (
        <Button
          variant="outline"
          className="self-center"
          disabled={listings.isFetching}
          onClick={() => setVisible((count) => count + BATCH)}
        >
          Show {formatNumber(Math.min(BATCH, total - vehicles.length))} more
        </Button>
      )}
    </div>
  )
}
