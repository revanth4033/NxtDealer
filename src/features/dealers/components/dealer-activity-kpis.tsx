import { CarFront, Clapperboard, EyeOff, Store } from 'lucide-react'

import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { formatNumber } from '@/lib/format'
import type { InventoryTotals } from '@/types'

/**
 * One dealer's inventory at a glance, from the same analytics totals the Dashboard uses: label, value and icon only.
 * Garage = published + not published; reels are counted per reel record, not per vehicle.
 */
export function DealerActivityKpis({ totals }: { totals: InventoryTotals | undefined }) {
  if (!totals) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} withContext={false} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Garage vehicles" value={formatNumber(totals.garageVehicles)} icon={CarFront} />
      <StatCard label="Marketplace vehicles" value={formatNumber(totals.marketplaceVehicles)} icon={Store} />
      <StatCard label="Unpublished vehicles" value={formatNumber(totals.unpublishedVehicles)} icon={EyeOff} />
      <StatCard label="AI reels created" value={formatNumber(totals.aiReels)} icon={Clapperboard} />
    </div>
  )
}
