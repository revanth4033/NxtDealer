import { Copy, Mail, MoreHorizontal } from 'lucide-react'

import { StatusBadge } from '@/components/common/status-badge'
import { createDataTableColumnHelper } from '@/components/data-table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { formatDate, formatDateTime, formatNumber, getInitials } from '@/lib/format'
import type { Dealer } from '@/types'

const column = createDataTableColumnHelper<Dealer>()

/** Builds the dealer columns. `onCopy` powers the row action menu. */
export function createDealerColumns(onCopy: (text: string, confirmation: string) => void) {
  return column.columns([
    column.accessor('businessName', {
      header: 'Dealer',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 rounded-lg after:rounded-lg">
            <AvatarFallback className="rounded-lg bg-muted text-caption font-semibold text-foreground-secondary">
              {getInitials(row.original.businessName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-medium text-foreground">{row.original.businessName}</p>
            <p className="truncate text-caption text-muted-foreground">{row.original.ownerName}</p>
          </div>
        </div>
      ),
      meta: { className: 'w-[26%] min-w-60' },
    }),
    column.accessor((dealer) => dealer.location.city, {
      id: 'location',
      meta: { className: 'w-[15%]' },
      header: 'Location',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="leading-tight">
          <p className="text-foreground">{row.original.location.city}</p>
          <p className="text-caption text-muted-foreground">{row.original.location.state}</p>
        </div>
      ),
    }),
    column.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: ({ getValue }) => <StatusBadge status={DEALER_STATUS[getValue()]} />,
      meta: { className: 'w-[12%]' },
    }),
    column.accessor('plan', {
      header: 'Plan',
      enableSorting: false,
      cell: ({ getValue }) => <StatusBadge status={DEALER_PLAN[getValue()]} hideDot />,
      meta: { className: 'w-[10%]' },
    }),
    column.accessor('activeListings', {
      header: 'Listings',
      cell: ({ getValue }) => formatNumber(getValue()),
      meta: { align: 'right', className: 'w-[9%]' },
    }),
    column.accessor('joinedAt', {
      header: 'Joined',
      cell: ({ getValue }) => <span className="text-foreground-secondary">{formatDate(getValue())}</span>,
    }),
    column.accessor('lastActiveAt', {
      header: 'Last active',
      cell: ({ getValue }) => <span className="text-foreground-secondary">{formatDateTime(getValue())}</span>,
    }),
    column.display({
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row.original.businessName}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="truncate">{row.original.businessName}</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => onCopy(row.original.id, `Copied dealer ID ${row.original.id}`)}>
              <Copy /> Copy dealer ID
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onCopy(row.original.email, `Copied ${row.original.email}`)}>
              <Mail /> Copy email address
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: { align: 'right', className: 'w-14' },
    }),
  ])
}
