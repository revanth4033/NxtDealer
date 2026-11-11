import type { ReactNode } from 'react'

import { StatusBadge } from '@/components/common/status-badge'
import { DEALER_PLAN, DEALER_STATUS, DEALER_VERIFICATION } from '@/config/status'
import { formatDate, formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Dealer } from '@/types'

/** Compact account summary used alongside KPI cards when a single dealer is in focus. */
export function DealerProfileCard({ dealer, className }: { dealer: Dealer; className?: string }) {
  const rows: [string, ReactNode][] = [
    ['Verification', <StatusBadge key="v" status={DEALER_VERIFICATION[dealer.verificationStatus]} />],
    ['Joined', formatDate(dealer.joinedAt)],
    ['Last active', formatRelative(dealer.lastActiveAt)],
  ]

  return (
    <div data-slot="stat-card" className={cn('surface flex flex-col gap-3 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground-secondary">Dealer account</p>
        <StatusBadge status={DEALER_STATUS[dealer.status]} />
      </div>
      <p className="flex items-center gap-2">
        <span className="text-xl font-semibold tracking-tight text-foreground">{DEALER_PLAN[dealer.plan].label}</span>
        <span className="text-caption text-muted-foreground">plan</span>
      </p>
      <dl className="mt-auto space-y-1.5 text-caption">
        {rows.map(([term, value]) => (
          <div key={term} className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="font-medium text-foreground-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
