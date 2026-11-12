import { Link } from 'react-router'

import { EntityAvatar } from '@/components/common/entity-avatar'
import { StatusBadge } from '@/components/common/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MARKETPLACE_STATUS } from '@/config/status'
import { formatDate, formatKm, formatPriceShort, formatRelative } from '@/lib/format'
import type { MarketplaceVehicle } from '@/types'

import { FUEL_LABELS, TRANSMISSION_LABELS } from '../vehicle-labels'
import { VehicleImage } from './vehicle-image'

interface VehicleCardProps {
  vehicle: MarketplaceVehicle
  /** Show which dealer published the vehicle (platform view). */
  showDealer?: boolean
  /**
   * Add the vehicle's city under the dealer name. Where the marketplace will later attribute a listing
   * to a showroom, this is the line that gains the showroom name.
   */
  showLocation?: boolean
  /** Show the marketplace status badge on the photo. */
  showStatus?: boolean
  /** How the publication time reads: "3 days ago" (default) or the calendar date. */
  publishedDate?: 'relative' | 'date'
  /** Makes the dealer name a link, e.g. to the dealer's details page. */
  dealerHref?: string
  /** Router state sent with the dealer link, e.g. where the dealer page's back link should return. */
  dealerLinkState?: unknown
  onSelect: (vehicle: MarketplaceVehicle) => void
}

/** Marketplace vehicle summary. The whole card opens a read-only detail preview. */
export function VehicleCard({
  vehicle,
  showDealer = true,
  showLocation = false,
  showStatus = false,
  publishedDate = 'relative',
  dealerHref,
  dealerLinkState,
  onSelect,
}: VehicleCardProps) {
  const { specs } = vehicle

  return (
    <article className="group surface flex w-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-raised">
      <button
        type="button"
        onClick={() => onSelect(vehicle)}
        className="flex flex-1 cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
        aria-label={`View ${vehicle.title}`}
      >
        <div className="relative overflow-hidden border-b">
          <VehicleImage
            src={vehicle.photos[0]}
            alt={vehicle.title}
            className="aspect-[16/10] w-full transition-transform duration-300 ease-out-soft group-hover:scale-[1.03]"
          />
          <span className="absolute top-2.5 left-2.5 rounded-md bg-card/95 px-1.5 py-0.5 text-caption font-medium text-foreground tabular-nums shadow-card">
            {specs.year}
          </span>
          {showStatus && (
            <StatusBadge status={MARKETPLACE_STATUS[vehicle.marketplace.status]} className="absolute top-2.5 right-2.5 shadow-card" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0 space-y-0.5">
            <h3 className="truncate font-semibold text-foreground">
              {specs.make} {specs.model}
            </h3>
            <p className="truncate text-caption text-muted-foreground">{specs.variant}</p>
          </div>

          <p className="text-lg font-semibold tracking-tight text-foreground tabular-nums">{formatPriceShort(vehicle.price)}</p>

          <ul className="flex flex-wrap gap-1.5 text-caption text-foreground-secondary" aria-label="Key specifications">
            {[FUEL_LABELS[specs.fuelType], TRANSMISSION_LABELS[specs.transmission], formatKm(specs.odometerKm)].map((item) => (
              <li key={item} className="rounded-md bg-muted px-1.5 py-0.5 tabular-nums">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </button>

      <footer className="flex items-center gap-2.5 border-t px-4 py-3">
        {showDealer ? (
          <>
            <EntityAvatar name={vehicle.dealerName} size="sm" />
            <span className="min-w-0 flex-1 leading-tight">
              {dealerHref ? (
                <Link
                  to={dealerHref}
                  state={dealerLinkState}
                  className="block truncate rounded-sm text-caption font-medium text-foreground-secondary outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {vehicle.dealerName}
                </Link>
              ) : (
                <span className="block truncate text-caption font-medium text-foreground-secondary">{vehicle.dealerName}</span>
              )}
              {showLocation && <span className="block truncate text-caption text-muted-foreground">{vehicle.city}</span>}
            </span>
          </>
        ) : (
          <span className="flex-1 truncate text-caption text-muted-foreground">{vehicle.city}</span>
        )}
        <time
          dateTime={vehicle.marketplace.publishedAt}
          title={`Published ${formatDate(vehicle.marketplace.publishedAt)}`}
          className="shrink-0 text-caption text-muted-foreground tabular-nums"
        >
          {publishedDate === 'date' ? (
            <>
              <span className="sr-only">Published </span>
              {formatDate(vehicle.marketplace.publishedAt)}
            </>
          ) : (
            formatRelative(vehicle.marketplace.publishedAt)
          )}
        </time>
      </footer>
    </article>
  )
}

export function VehicleCardSkeleton() {
  return (
    <div aria-hidden className="surface overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="border-t px-4 py-3">
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
