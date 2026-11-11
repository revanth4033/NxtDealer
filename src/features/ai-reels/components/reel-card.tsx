import { Play } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDuration } from '@/lib/format'
import type { AiReel } from '@/types'

interface ReelCardProps {
  reel: AiReel
  /** Show which dealer created the reel (platform view). */
  showDealer?: boolean
  /** e.g. "Reel 2 of 3" when a vehicle has several reels. */
  sequenceLabel?: string
  onSelect: (reel: AiReel) => void
}

/** Portrait reel thumbnail. Clicking opens the preview player — nothing plays until then. */
export function ReelCard({ reel, showDealer = true, sequenceLabel, onSelect }: ReelCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(reel)}
      aria-label={`Play reel for ${reel.vehicleTitle}, created ${formatDate(reel.createdAt)}`}
      className="group flex min-w-0 cursor-pointer flex-col gap-2.5 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border bg-foreground shadow-card">
        <img
          src={reel.thumbnailUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 ease-out-soft group-hover:scale-[1.03]"
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/40 backdrop-blur-sm transition-[transform,background-color] duration-200 ease-out-soft group-hover:scale-110 group-hover:bg-black/60"
        >
          <Play className="ml-0.5 size-3.5 fill-current" />
        </span>
        <span className="absolute right-2 bottom-2 rounded-md bg-black/60 px-1.5 py-0.5 text-caption font-medium text-white tabular-nums">
          {formatDuration(reel.durationSeconds)}
        </span>
        {sequenceLabel && (
          <span className="absolute top-2 left-2 rounded-md bg-card/95 px-1.5 py-0.5 text-caption font-medium text-foreground shadow-card">
            {sequenceLabel}
          </span>
        )}
      </div>
      <div className="min-w-0 space-y-0.5 px-0.5">
        <p className="line-clamp-2 text-sm font-medium text-foreground">{reel.vehicleTitle}</p>
        <p className="truncate text-caption text-muted-foreground">
          {showDealer ? reel.dealerName : formatDate(reel.createdAt)}
        </p>
      </div>
    </button>
  )
}

export function ReelCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2.5">
      <Skeleton className="aspect-[9/16] w-full rounded-xl" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
