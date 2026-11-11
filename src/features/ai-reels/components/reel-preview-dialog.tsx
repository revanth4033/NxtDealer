import { CarFront } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDateTime, formatDuration } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AiReel } from '@/types'

import { useAiReels } from '../hooks/use-ai-reels'
import { getReelSequenceLabels } from '../reel-sequence'

interface ReelPreviewDialogProps {
  reel: AiReel | null
  onOpenChange: (open: boolean) => void
  /** Opens the read-only vehicle preview for the reel's vehicle. */
  onViewVehicle?: (vehicleId: string) => void
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Read-only reel player with the other reels made for the same vehicle. No edit or regenerate actions. */
export function ReelPreviewDialog({ reel, onOpenChange, onViewVehicle }: ReelPreviewDialogProps) {
  return (
    <Dialog open={reel !== null} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {reel && <ReelPreview key={reel.id} initialReel={reel} onViewVehicle={onViewVehicle} />}
      </DialogContent>
    </Dialog>
  )
}

function ReelPreview({ initialReel, onViewVehicle }: { initialReel: AiReel; onViewVehicle?: (vehicleId: string) => void }) {
  const [current, setCurrent] = useState(initialReel)
  const siblings = useAiReels({ vehicleId: initialReel.vehicleId, pageSize: 50, sortBy: 'createdAt', sortDirection: 'asc' })
  const vehicleReels = siblings.data?.data ?? []
  const sequence = getReelSequenceLabels(vehicleReels).get(current.id)

  return (
    <div className="grid md:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="flex items-center justify-center bg-foreground p-4 md:p-6">
        <video
          key={current.id}
          src={current.videoUrl}
          poster={current.thumbnailUrl}
          controls
          playsInline
          autoPlay={!prefersReducedMotion()}
          muted
          loop
          className="aspect-[9/16] max-h-[min(70vh,34rem)] w-full rounded-lg bg-black object-contain"
          aria-label={`Reel for ${current.vehicleTitle}`}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-5 p-6">
        <div className="space-y-1.5 pr-8">
          <DialogTitle className="text-section-title font-semibold">{current.vehicleTitle}</DialogTitle>
          <DialogDescription>
            Created by {current.dealerName} on {formatDateTime(current.createdAt)}
          </DialogDescription>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-caption text-muted-foreground">Duration</dt>
            <dd className="font-medium tabular-nums">{formatDuration(current.durationSeconds)}</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">For this vehicle</dt>
            <dd className="font-medium">
              {siblings.isPending ? <Skeleton className="mt-1 h-4 w-20" /> : (sequence ?? 'Only reel')}
            </dd>
          </div>
        </dl>

        {vehicleReels.length > 1 && (
          <section aria-labelledby="reel-siblings-title" className="space-y-2.5">
            <h3 id="reel-siblings-title" className="text-caption font-medium text-muted-foreground">
              All reels for this vehicle
            </h3>
            <ul className="flex flex-wrap gap-2">
              {vehicleReels.map((reel, index) => (
                <li key={reel.id}>
                  <button
                    type="button"
                    onClick={() => setCurrent(reel)}
                    aria-current={reel.id === current.id ? 'true' : undefined}
                    aria-label={`Reel ${index + 1}, created ${formatDate(reel.createdAt)}`}
                    className={cn(
                      'block w-14 cursor-pointer overflow-hidden rounded-md border-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                      reel.id === current.id ? 'border-primary' : 'border-transparent hover:border-border',
                    )}
                  >
                    <img src={reel.thumbnailUrl} alt="" className="aspect-[9/16] w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-auto flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted-foreground">Preview only. Reels are created and managed by dealers in the app.</p>
          {onViewVehicle && (
            <Button variant="outline" size="sm" onClick={() => onViewVehicle(current.vehicleId)} className="shrink-0">
              <CarFront /> View vehicle
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
