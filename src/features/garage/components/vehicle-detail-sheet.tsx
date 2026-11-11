import { useState } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { EntityAvatar } from '@/components/common/entity-avatar'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { MARKETPLACE_STATUS } from '@/config/status'
import { ReelCard } from '@/features/ai-reels/components/reel-card'
import { useAiReels } from '@/features/ai-reels/hooks/use-ai-reels'
import { getReelSequenceLabels } from '@/features/ai-reels/reel-sequence'
import { formatDate, formatKm, formatMoney, formatOrdinal, formatPriceShort } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AiReel, GarageVehicle } from '@/types'

import { useGarageVehicle } from '../hooks/use-garage-vehicles'
import { BODY_TYPE_LABELS, FUEL_LABELS, TRANSMISSION_LABELS } from '../vehicle-labels'
import { VehicleImage } from './vehicle-image'

interface VehicleDetailSheetProps {
  vehicleId: string | null
  onOpenChange: (open: boolean) => void
  onPlayReel: (reel: AiReel) => void
}

/** Read-only vehicle preview: photos, specs, marketplace state and reels. Admins can't edit or publish. */
export function VehicleDetailSheet({ vehicleId, onOpenChange, onPlayReel }: VehicleDetailSheetProps) {
  return (
    <Sheet open={vehicleId !== null} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 overflow-y-auto p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        {vehicleId && <VehicleDetail key={vehicleId} vehicleId={vehicleId} onPlayReel={onPlayReel} />}
      </SheetContent>
    </Sheet>
  )
}

function VehicleDetail({ vehicleId, onPlayReel }: { vehicleId: string; onPlayReel: (reel: AiReel) => void }) {
  const vehicle = useGarageVehicle(vehicleId)

  if (vehicle.isError) {
    return (
      <>
        <SheetTitle className="sr-only">Vehicle</SheetTitle>
        <EmptyState
          variant="error"
          title="Vehicle couldn’t be loaded"
          description="The garage service didn’t respond. Close this panel and try again."
          action={
            <Button variant="outline" onClick={() => vehicle.refetch()}>
              Try again
            </Button>
          }
        />
      </>
    )
  }

  if (vehicle.isPending) {
    return (
      <div aria-busy className="space-y-5 p-6">
        <SheetTitle className="sr-only">Loading vehicle</SheetTitle>
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return <VehicleDetailContent vehicle={vehicle.data} onPlayReel={onPlayReel} />
}

function VehicleDetailContent({ vehicle, onPlayReel }: { vehicle: GarageVehicle; onPlayReel: (reel: AiReel) => void }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const { specs, marketplace } = vehicle

  const specRows: [string, string][] = [
    ['Year', String(specs.year)],
    ['Body type', BODY_TYPE_LABELS[specs.bodyType]],
    ['Fuel', FUEL_LABELS[specs.fuelType]],
    ['Transmission', TRANSMISSION_LABELS[specs.transmission]],
    ['Odometer', formatKm(specs.odometerKm)],
    ['Colour', specs.colour],
    ['Ownership', `${formatOrdinal(specs.owners)} owner`],
    ['Added to garage', formatDate(vehicle.addedAt)],
  ]

  return (
    <>
      <SheetHeader className="gap-3 border-b p-6 pr-12">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={MARKETPLACE_STATUS[marketplace.status]} />
          {marketplace.status === 'published' && (
            <span className="text-caption text-muted-foreground">since {formatDate(marketplace.publishedAt)}</span>
          )}
        </div>
        <SheetTitle className="text-page-title font-semibold">{vehicle.title}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-semibold text-foreground tabular-nums">{formatPriceShort(vehicle.price)}</span>
          <span className="tabular-nums">{formatMoney(vehicle.price)}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 p-6">
        <section aria-label="Photos" className="space-y-2.5">
          <VehicleImage
            src={vehicle.photos[photoIndex]}
            alt={`${vehicle.title}, photo ${photoIndex + 1} of ${Math.max(1, vehicle.photos.length)}`}
            className="aspect-[4/3] w-full rounded-lg border"
          />
          {vehicle.photos.length > 1 && (
            <ul className="flex gap-2">
              {vehicle.photos.map((photo, index) => (
                <li key={photo}>
                  <button
                    type="button"
                    onClick={() => setPhotoIndex(index)}
                    aria-label={`Show photo ${index + 1}`}
                    aria-current={index === photoIndex ? 'true' : undefined}
                    className={cn(
                      'block w-20 cursor-pointer overflow-hidden rounded-md border-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40',
                      index === photoIndex ? 'border-primary' : 'border-transparent hover:border-border',
                    )}
                  >
                    <img src={photo} alt="" className="aspect-[4/3] w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="vehicle-specs-title" className="space-y-3">
          <h3 id="vehicle-specs-title" className="text-sm font-semibold">
            Specifications
          </h3>
          <dl className="grid grid-cols-2 overflow-hidden rounded-lg border">
            {specRows.map(([term, value], index) => (
              <div key={term} className={cn('space-y-0.5 px-4 py-3', index % 2 === 0 && 'border-r', index < specRows.length - 2 && 'border-b')}>
                <dt className="text-caption text-muted-foreground">{term}</dt>
                <dd className="font-medium text-foreground tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="vehicle-dealer-title" className="space-y-3">
          <h3 id="vehicle-dealer-title" className="text-sm font-semibold">
            Dealer
          </h3>
          <div className="flex items-center gap-3">
            <EntityAvatar name={vehicle.dealerName} />
            <div className="leading-tight">
              <p className="font-medium text-foreground">{vehicle.dealerName}</p>
              <p className="text-caption text-muted-foreground">{vehicle.city}</p>
            </div>
          </div>
        </section>

        <VehicleReels vehicle={vehicle} onPlayReel={onPlayReel} />

        <p className="border-t pt-4 text-caption text-muted-foreground">
          Read-only view. Dealers manage their garage and marketplace listings in the NxtDealer app.
        </p>
      </div>
    </>
  )
}

function VehicleReels({ vehicle, onPlayReel }: { vehicle: GarageVehicle; onPlayReel: (reel: AiReel) => void }) {
  const reels = useAiReels({ vehicleId: vehicle.id, pageSize: 50 }, { enabled: vehicle.aiReelCount > 0 })
  const items = reels.data?.data ?? []
  const sequence = getReelSequenceLabels(items)

  return (
    <section aria-labelledby="vehicle-reels-title" className="space-y-3">
      <h3 id="vehicle-reels-title" className="text-sm font-semibold">
        AI reels <span className="font-normal text-muted-foreground tabular-nums">({vehicle.aiReelCount})</span>
      </h3>
      {vehicle.aiReelCount === 0 ? (
        <p className="text-sm text-muted-foreground">No reels have been generated for this vehicle.</p>
      ) : reels.isPending ? (
        <Skeleton className="h-40 w-28 rounded-xl" />
      ) : (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((reel) => (
            <li key={reel.id}>
              <ReelCard reel={reel} showDealer={false} sequenceLabel={sequence.get(reel.id)} onSelect={onPlayReel} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
