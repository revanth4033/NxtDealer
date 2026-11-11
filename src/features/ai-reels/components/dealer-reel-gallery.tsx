import { useState, type ReactNode } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { FilterDropdown, type FilterOption } from '@/components/common/filter-dropdown'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/format'
import type { AiReel, Dealer } from '@/types'

import { useAiReels } from '../hooks/use-ai-reels'
import { getReelSequenceLabels } from '../reel-sequence'
import { ReelCard, ReelCardSkeleton } from './reel-card'

const DEALER_BATCH = 12
const GRID = 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

/** Every reel by one dealer, filterable by vehicle. */
export function DealerReelGallery({ dealer, onPlayReel }: { dealer: Dealer; onPlayReel: (reel: AiReel) => void }) {
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
      <ReelGrid>
        {shown.map((reel) => (
          <li key={reel.id}>
            <ReelCard reel={reel} showDealer={false} sequenceLabel={sequence.get(reel.id)} onSelect={onPlayReel} />
          </li>
        ))}
      </ReelGrid>
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

/** Responsive portrait-card grid shared by every reel listing. Children are <li> elements. */
export function ReelGrid({ children }: { children: ReactNode }) {
  return <ul className={GRID}>{children}</ul>
}

export function ReelGridSkeleton({ count }: { count: number }) {
  return (
    <div className={GRID} aria-busy>
      {Array.from({ length: count }, (_, i) => (
        <ReelCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ReelsError({ onRetry }: { onRetry: () => void }) {
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
