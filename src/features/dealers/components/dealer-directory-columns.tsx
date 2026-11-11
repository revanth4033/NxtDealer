import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { EntityAvatar } from '@/components/common/entity-avatar'
import { StatusBadge } from '@/components/common/status-badge'
import { createDataTableColumnHelper } from '@/components/data-table'
import { dealerDetailsPath } from '@/config/routes'
import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { formatDate, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Dealer } from '@/types'

/** Router state passed to the details page so "Back to dealers" restores the directory view. */
export interface DealerDirectoryLinkState {
  directorySearch: string
}

const column = createDataTableColumnHelper<Dealer>()

/** Zero reads as muted so the dealers with inventory stand out when scanning a column. */
const renderCount = (value: number) => (
  <span className={cn(value === 0 ? 'text-muted-foreground' : 'font-medium text-foreground')}>{formatNumber(value)}</span>
)

export function createDealerDirectoryColumns(linkState: DealerDirectoryLinkState) {
  return column.columns([
    column.accessor('businessName', {
      header: 'Dealer',
      cell: ({ row }) => (
        <Link
          to={dealerDetailsPath(row.original.id)}
          state={linkState}
          className="group/dealer -m-1 flex min-w-0 items-center gap-3 rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <EntityAvatar name={row.original.businessName} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-medium text-foreground group-hover/dealer:text-primary">
              {row.original.businessName}
            </span>
            <span className="block truncate text-caption text-muted-foreground">
              <span className="sr-only">Owner: </span>
              {row.original.ownerName}
            </span>
          </span>
        </Link>
      ),
      meta: { className: 'min-w-60' },
    }),
    column.accessor((dealer) => dealer.location.city, {
      id: 'city',
      header: 'Location',
      cell: ({ row }) => (
        <span className="block leading-tight">
          <span className="block text-foreground-secondary">{row.original.location.city}</span>
          <span className="block text-caption text-muted-foreground">{row.original.location.state}</span>
        </span>
      ),
    }),
    column.accessor('plan', {
      header: 'Plan',
      enableSorting: false,
      cell: ({ getValue }) => <span className="text-foreground-secondary">{DEALER_PLAN[getValue()].label}</span>,
    }),
    column.accessor('status', {
      header: 'Account status',
      enableSorting: false,
      cell: ({ getValue }) => <StatusBadge status={DEALER_STATUS[getValue()]} />,
    }),
    column.accessor((dealer) => dealer.stats.garageVehicles, {
      id: 'garageVehicles',
      header: 'Garage',
      cell: ({ getValue }) => renderCount(getValue()),
      meta: { align: 'right' },
    }),
    column.accessor((dealer) => dealer.stats.marketplaceVehicles, {
      id: 'marketplaceVehicles',
      header: 'Marketplace',
      cell: ({ getValue }) => renderCount(getValue()),
      meta: { align: 'right' },
    }),
    column.accessor((dealer) => dealer.stats.aiReels, {
      id: 'aiReels',
      header: 'AI reels',
      cell: ({ getValue }) => renderCount(getValue()),
      meta: { align: 'right' },
    }),
    column.accessor('joinedAt', {
      header: 'Joined',
      cell: ({ getValue }) => <span className="text-foreground-secondary">{formatDate(getValue())}</span>,
    }),
    column.display({
      id: 'open',
      header: () => <span className="sr-only">Open</span>,
      cell: () => (
        <ChevronRight
          aria-hidden
          className="ml-auto size-4 text-muted-foreground/60 transition-colors group-hover/row:text-foreground-secondary"
        />
      ),
      meta: { align: 'right', className: 'w-10 pl-0' },
    }),
  ])
}
