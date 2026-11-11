import { CalendarDays, Copy, Hash, MapPin, UserRound, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { EntityAvatar } from '@/components/common/entity-avatar'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { formatDate } from '@/lib/format'
import type { Dealer } from '@/types'

/** Identity block at the top of a dealer's page: who they are, where, and their account state. Read-only. */
export function DealerProfileHeader({ dealer }: { dealer: Dealer }) {
  const { copy, message } = useCopyToClipboard()
  const plan = DEALER_PLAN[dealer.plan]

  return (
    <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:gap-5">
      <EntityAvatar name={dealer.businessName} size="lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-page-title text-foreground">{dealer.businessName}</h1>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={DEALER_STATUS[dealer.status]} />
            <StatusBadge label={`${plan.label} plan`} tone={plan.tone} hideDot />
          </div>
        </div>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-foreground-secondary">
          <MetaItem icon={UserRound}>Owned by {dealer.ownerName}</MetaItem>
          <MetaItem icon={MapPin}>
            {dealer.location.city}, {dealer.location.state}
          </MetaItem>
          <MetaItem icon={CalendarDays}>Joined {formatDate(dealer.joinedAt)}</MetaItem>
          <MetaItem icon={Hash}>
            <span className="tabular-nums">{dealer.id}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Copy dealer ID"
              onClick={() => copy(dealer.id, `Copied dealer ID ${dealer.id}`)}
              className="-my-1 text-muted-foreground"
            >
              <Copy />
            </Button>
            <span role="status" aria-live="polite" className="text-caption font-medium text-success">
              {message}
            </span>
          </MetaItem>
        </ul>
      </div>
    </header>
  )
}

function MetaItem({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      {children}
    </li>
  )
}
