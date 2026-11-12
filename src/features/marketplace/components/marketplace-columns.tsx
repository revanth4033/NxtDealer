import { Link } from 'react-router'

import { EntityAvatar } from '@/components/common/entity-avatar'
import { createDataTableColumnHelper } from '@/components/data-table'
import { dealerDetailsPath } from '@/config/routes'
import type { DealerLinkState } from '@/features/dealers/dealer-link-state'
import { VehicleImage } from '@/features/garage/components/vehicle-image'
import { FUEL_LABELS, TRANSMISSION_LABELS } from '@/features/garage/vehicle-labels'
import { formatDate, formatPriceShort } from '@/lib/format'
import type { MarketplaceVehicle } from '@/types'

const column = createDataTableColumnHelper<MarketplaceVehicle>()

/**
 * Marketplace directory columns. Sortable column ids match `MarketplaceSortField` (year, price,
 * publishedAt). There's no status column: every row is a published listing.
 */
export function createMarketplaceColumns(onSelect: (vehicle: MarketplaceVehicle) => void, dealerLinkState: DealerLinkState) {
  return column.columns([
    column.display({
      id: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => {
        const vehicle = row.original
        return (
          <button
            type="button"
            onClick={() => onSelect(vehicle)}
            aria-label={`View ${vehicle.title}`}
            className="group/vehicle -m-1 flex cursor-pointer items-center gap-3 rounded-md p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <VehicleImage src={vehicle.photos[0]} alt="" compact className="h-10 w-14 shrink-0 rounded-md border" />
            {/* Model over make, like variant over colour beside it, keeps nine columns within 1440px. */}
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-medium text-foreground group-hover/vehicle:text-primary">
                {vehicle.specs.model}
              </span>
              <span className="block truncate text-caption text-muted-foreground">{vehicle.specs.make}</span>
            </span>
          </button>
        )
      },
      meta: { className: 'min-w-44' },
    }),
    column.display({
      id: 'variant',
      header: 'Variant / colour',
      cell: ({ row }) => (
        <span className="block leading-tight">
          <span className="block text-foreground-secondary">{row.original.specs.variant ?? '–'}</span>
          <span className="block text-caption text-muted-foreground">{row.original.specs.colour}</span>
        </span>
      ),
      meta: { className: 'min-w-32' },
    }),
    column.display({
      id: 'dealer',
      header: 'Dealer',
      cell: ({ row }) => (
        <Link
          to={dealerDetailsPath(row.original.dealerId)}
          state={dealerLinkState}
          className="group/dealer -m-1 flex min-w-0 items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <EntityAvatar name={row.original.dealerName} size="sm" />
          <span className="truncate text-foreground-secondary group-hover/dealer:text-primary group-hover/dealer:underline">
            {row.original.dealerName}
          </span>
        </Link>
      ),
      meta: { className: 'min-w-44' },
    }),
    column.display({
      id: 'city',
      header: 'City',
      cell: ({ row }) => <span className="text-foreground-secondary">{row.original.city}</span>,
    }),
    column.accessor((vehicle) => vehicle.specs.year, {
      id: 'year',
      header: 'Year',
      cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
    }),
    column.accessor((vehicle) => vehicle.price.amount, {
      id: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="font-medium tabular-nums">{formatPriceShort(row.original.price)}</span>,
      meta: { align: 'right' },
    }),
    column.display({
      id: 'fuel',
      header: 'Fuel',
      cell: ({ row }) => <span className="text-foreground-secondary">{FUEL_LABELS[row.original.specs.fuelType]}</span>,
    }),
    column.display({
      id: 'transmission',
      header: 'Transmission',
      cell: ({ row }) => <span className="text-foreground-secondary">{TRANSMISSION_LABELS[row.original.specs.transmission]}</span>,
    }),
    column.accessor((vehicle) => vehicle.marketplace.publishedAt, {
      id: 'publishedAt',
      header: 'Published date',
      cell: ({ getValue }) => <span className="whitespace-nowrap text-foreground-secondary tabular-nums">{formatDate(getValue())}</span>,
    }),
  ])
}
