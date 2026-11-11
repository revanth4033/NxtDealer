import { CarFront, Clapperboard, EyeOff, Store } from 'lucide-react'

import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { formatNumber } from '@/lib/format'
import type { InventoryTotals } from '@/types'

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

/**
 * One dealer's inventory at a glance, from the same analytics totals the Dashboard uses.
 * Garage = published + not published; reels are counted per reel record, not per vehicle.
 */
export function DealerActivityKpis({ totals }: { totals: InventoryTotals | undefined }) {
  if (!totals) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const emptyGarage = totals.garageVehicles === 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Garage vehicles"
        value={formatNumber(totals.garageVehicles)}
        icon={CarFront}
        context={emptyGarage ? 'Garage is empty' : 'Published and not published'}
      />
      <StatCard
        label="Marketplace vehicles"
        value={formatNumber(totals.marketplaceVehicles)}
        icon={Store}
        context={emptyGarage ? 'Nothing in the garage to publish' : `Of ${plural(totals.garageVehicles, 'garage vehicle', 'garage vehicles')}`}
      />
      <StatCard
        label="Unpublished vehicles"
        value={formatNumber(totals.unpublishedVehicles)}
        icon={EyeOff}
        context={emptyGarage ? 'Garage is empty' : 'In the garage only'}
      />
      <StatCard
        label="AI reels created"
        value={formatNumber(totals.aiReels)}
        icon={Clapperboard}
        context={totals.aiReels === 0 ? 'No reels created yet' : `Covering ${plural(totals.vehiclesWithReels, 'vehicle', 'vehicles')}`}
      />
    </div>
  )
}
