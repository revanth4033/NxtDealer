import type { ReactNode } from 'react'

import { SectionHeader } from '@/components/common/section-header'
import { StatusBadge } from '@/components/common/status-badge'
import { PageSection } from '@/components/layout/page-container'
import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { formatDate, formatDateTime, formatRelative } from '@/lib/format'
import type { Dealer } from '@/types'

/** Every account field the dealer model provides. Fields the model doesn't have (e.g. a business address) are omitted. */
export function DealerInformation({ dealer }: { dealer: Dealer }) {
  const rows: [string, ReactNode][] = [
    ['Business name', dealer.businessName],
    ['Owner', dealer.ownerName],
    ['Contact number', <span key="phone" className="tabular-nums">{dealer.phone}</span>],
    ['Email', <span key="email" className="break-all">{dealer.email}</span>],
    ['City', dealer.location.city],
    ['State', dealer.location.state],
    ['Subscription plan', DEALER_PLAN[dealer.plan].label],
    ['Account status', <StatusBadge key="status" status={DEALER_STATUS[dealer.status]} />],
    ['Registered', formatDate(dealer.joinedAt)],
    [
      'Last active',
      <span key="last-active">
        {formatRelative(dealer.lastActiveAt)}
        <span className="ml-1.5 font-normal text-muted-foreground">{formatDateTime(dealer.lastActiveAt)}</span>
      </span>,
    ],
  ]

  return (
    <PageSection labelledBy="dealer-information">
      <SectionHeader id="dealer-information" title="Dealer information" description="Account details from the NxtDealer app." />
      <div className="surface overflow-hidden">
        <dl className="grid gap-px bg-border sm:grid-cols-2">
          {rows.map(([term, value]) => (
            <div key={term} className="space-y-1 bg-card px-5 py-3.5">
              <dt className="text-caption text-muted-foreground">{term}</dt>
              <dd className="font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PageSection>
  )
}
