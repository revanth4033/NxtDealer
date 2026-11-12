import { useCallback, useState } from 'react'

import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { NAV_ITEMS } from '@/config/navigation'
import { ReelPreviewDialog } from '@/features/ai-reels/components/reel-preview-dialog'
import { VehicleDetailSheet } from '@/features/garage/components/vehicle-detail-sheet'
import { MarketplaceDirectory } from '@/features/marketplace/components/marketplace-directory'
import { MarketplaceInsights } from '@/features/marketplace/components/marketplace-insights'
import { MarketplaceKpis } from '@/features/marketplace/components/marketplace-kpis'
import { RecentListings } from '@/features/marketplace/components/recent-listings'
import { useMarketplaceInsights } from '@/features/marketplace/hooks/use-marketplace-insights'
import { formatNumber } from '@/lib/format'
import type { AiReel, GarageVehicle } from '@/types'

const { label, description } = NAV_ITEMS.marketplace

/**
 * Read-only monitoring of the shared marketplace: totals, where listings come from, what was
 * published most recently, and a directory of every published vehicle. Dealers publish and
 * unpublish in the NxtDealer app; admins can only look.
 */
export function MarketplacePage() {
  const insights = useMarketplaceInsights()
  const published = insights.data?.totals.publishedListings

  // One preview for the whole page, opened from recent listings, the table or the grid.
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const [reel, setReel] = useState<AiReel | null>(null)
  const selectVehicle = useCallback((vehicle: GarageVehicle) => setVehicleId(vehicle.id), [])

  return (
    <PageContainer>
      <PageHeader
        title={label}
        description={description}
        meta={
          published === undefined ? (
            insights.isPending && <Skeleton className="h-6 w-24" />
          ) : (
            <span className="inline-flex h-6 items-center rounded-md bg-muted px-2 text-caption font-medium text-foreground-secondary tabular-nums">
              {formatNumber(published)} published
            </span>
          )
        }
      />
      <MarketplaceKpis />
      <MarketplaceInsights />
      <RecentListings onSelectVehicle={selectVehicle} />
      <MarketplaceDirectory onSelectVehicle={selectVehicle} />

      <VehicleDetailSheet vehicleId={vehicleId} onOpenChange={(open) => !open && setVehicleId(null)} onPlayReel={setReel} />
      <ReelPreviewDialog
        reel={reel}
        onOpenChange={(open) => !open && setReel(null)}
        onViewVehicle={(id) => {
          setReel(null)
          setVehicleId(id)
        }}
      />
    </PageContainer>
  )
}
