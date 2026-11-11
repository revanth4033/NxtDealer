import { useState } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { FilterDropdown, type FilterOption } from '@/components/common/filter-dropdown'
import { SectionHeader } from '@/components/common/section-header'
import { SectionLink } from '@/components/common/section-link'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/config/routes'
import { ReelCard, ReelCardSkeleton } from '@/features/ai-reels/components/reel-card'
import { useAiReels } from '@/features/ai-reels/hooks/use-ai-reels'
import { getReelSequenceLabels } from '@/features/ai-reels/reel-sequence'
import { formatNumber } from '@/lib/format'
import type { AiReel, Dealer, InventoryTotals } from '@/types'

const PLATFORM_PREVIEW = 6
const DEALER_BATCH = 12
const GRID = 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'

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
    <ul className={GRID}>
      {latestPerVehicle.map((reel) => (
        <li key={reel.id}>
          <ReelCard reel={reel} onSelect={onPlayReel} />
        </li>
      ))}
    </ul>
  )
}

/** Every reel by one dealer, filterable by vehicle. */
function DealerReelGallery({ dealer, onPlayReel }: { dealer: Dealer; onPlayReel: (reel: AiReel) => void }) {
  const [vehicleId, setVehicleId] = useState<string>()
  const [visible, setVisible] = useState(DEALER_BATCH)
  // A dealer's full reel set is small; loading it once lets us label "Reel 2 of 3" accurately.
  const reels = useAiReels({ dealerId: dealer.id, pageSize: 500 })

  if (reels.isPending) return <ReelGridSkeleton count={6} />
  if (reels.isError) return <ReelsError onRetry={() => reels.refetch()} />

  const all = reels.data.data
  if (all.length === 0) {
    return (
      <div className="surface">
        <EmptyState
          compact
          title="No AI reels yet"
          description={
            dealer.stats.garageVehicles > 0
              ? `${dealer.businessName} hasn’t generated a reel for any of their ${plural(dealer.stats.garageVehicles, 'vehicle', 'vehicles')}.`
              : `${dealer.businessName} has no vehicles to create reels from yet.`
          }
        />
      </div>
    )
  }

  const sequence = getReelSequenceLabels(all)
  const vehicleOptions = buildVehicleOptions(all)
  const filtered = vehicleId ? all.filter((reel) => reel.vehicleId === vehicleId) : all
  const shown = filtered.slice(0, visible)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterDropdown
          mode="single"
          label="Vehicle"
          options={vehicleOptions}
          value={vehicleId}
          onValueChange={(next) => {
            setVehicleId(next)
            setVisible(DEALER_BATCH)
          }}
        />
        <p className="text-caption text-muted-foreground tabular-nums" aria-live="polite">
          Showing {formatNumber(shown.length)} of {plural(filtered.length, 'reel', 'reels')}
        </p>
      </div>
      <ul className={GRID}>
        {shown.map((reel) => (
          <li key={reel.id}>
            <ReelCard reel={reel} showDealer={false} sequenceLabel={sequence.get(reel.id)} onSelect={onPlayReel} />
          </li>
        ))}
      </ul>
      {shown.length < filtered.length && (
        <Button variant="outline" className="self-center" onClick={() => setVisible((count) => count + DEALER_BATCH)}>
          Show {formatNumber(Math.min(DEALER_BATCH, filtered.length - shown.length))} more
        </Button>
      )}
    </div>
  )
}

/** One option per vehicle, with how many reels it has. */
function buildVehicleOptions(reels: readonly AiReel[]): FilterOption[] {
  const counts = new Map<string, { label: string; count: number }>()
  for (const reel of reels) {
    const entry = counts.get(reel.vehicleId) ?? { label: reel.vehicleTitle, count: 0 }
    entry.count++
    counts.set(reel.vehicleId, entry)
  }
  return [...counts.entries()]
    .map(([value, { label, count }]) => ({ value, label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function ReelGridSkeleton({ count }: { count: number }) {
  return (
    <div className={GRID} aria-busy>
      {Array.from({ length: count }, (_, i) => (
        <ReelCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ReelsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="surface">
      <EmptyState
        compact
        variant="error"
        title="AI reels couldn’t be loaded"
        description="The reels service didn’t respond. Try again in a moment."
        action={
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    </div>
  )
}
