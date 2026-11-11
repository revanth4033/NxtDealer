import { EmptyState } from '@/components/common/empty-state'
import { SectionHeader } from '@/components/common/section-header'
import { SectionLink } from '@/components/common/section-link'
import { PageSection } from '@/components/layout/page-container'
import { ROUTES } from '@/config/routes'
import { DealerReelGallery, ReelGrid, ReelGridSkeleton, ReelsError } from '@/features/ai-reels/components/dealer-reel-gallery'
import { ReelCard } from '@/features/ai-reels/components/reel-card'
import { useAiReels } from '@/features/ai-reels/hooks/use-ai-reels'
import { formatNumber } from '@/lib/format'
import type { AiReel, Dealer, InventoryTotals } from '@/types'

const PLATFORM_PREVIEW = 6

interface ReelsOverviewProps {
  dealer: Dealer | undefined
  totals: InventoryTotals | undefined
  onPlayReel: (reel: AiReel) => void
}

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

export function ReelsOverview({ dealer, totals, onPlayReel }: ReelsOverviewProps) {
  const description = totals
    ? totals.aiReels === 0
      ? 'No reels have been created yet.'
      : `${plural(totals.aiReels, 'reel', 'reels')} covering ${plural(totals.vehiclesWithReels, 'vehicle', 'vehicles')}. A vehicle can have several reels.`
    : 'Promotional videos dealers generate from vehicle photos.'

  return (
    <PageSection labelledBy="dashboard-reels">
      <SectionHeader
        id="dashboard-reels"
        title={dealer ? `AI reels by ${dealer.businessName}` : 'AI reels'}
        description={description}
        actions={<SectionLink to={ROUTES.aiReels}>Open AI reels</SectionLink>}
      />
      {dealer ? <DealerReelGallery dealer={dealer} onPlayReel={onPlayReel} /> : <PlatformReelStrip onPlayReel={onPlayReel} />}
    </PageSection>
  )
}

/**
 * Newest reels across all dealers, one per vehicle so the preview isn't dominated by a single car.
 * Every reel still counts in the totals; the player lists all reels for a vehicle.
 */
function PlatformReelStrip({ onPlayReel }: { onPlayReel: (reel: AiReel) => void }) {
  const reels = useAiReels({ pageSize: 60 })

  if (reels.isPending) return <ReelGridSkeleton count={PLATFORM_PREVIEW} />
  if (reels.isError) return <ReelsError onRetry={() => reels.refetch()} />
  if (reels.data.data.length === 0) {
    return (
      <div className="surface">
        <EmptyState compact title="No AI reels yet" description="Reels appear here once dealers generate them from vehicle photos." />
      </div>
    )
  }

  // One card per vehicle, and never two identical thumbnails side by side (mock reels share media files;
  // with real data every thumbnail is unique, so the second check never removes anything).
  const seenVehicles = new Set<string>()
  const seenThumbnails = new Set<string>()
  const latestPerVehicle = reels.data.data
    .filter((reel) => {
      if (seenVehicles.has(reel.vehicleId) || seenThumbnails.has(reel.thumbnailUrl)) return false
      seenVehicles.add(reel.vehicleId)
      seenThumbnails.add(reel.thumbnailUrl)
      return true
    })
    .slice(0, PLATFORM_PREVIEW)

  return (
    <ReelGrid>
      {latestPerVehicle.map((reel) => (
        <li key={reel.id}>
          <ReelCard reel={reel} onSelect={onPlayReel} />
        </li>
      ))}
    </ReelGrid>
  )
}
