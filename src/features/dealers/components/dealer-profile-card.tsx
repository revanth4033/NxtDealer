import { StatusBadge } from '@/components/common/status-badge'
import { DEALER_PLAN, DEALER_STATUS } from '@/config/status'
import { cn } from '@/lib/utils'
import type { Dealer } from '@/types'

/**
 * The dealer's account beside their KPI cards when a single dealer is in focus. Same structure as `StatCard`
 * (label, value, item in the corner) so the row stays one height: the plan is the value, the status the corner item.
 */
export function DealerProfileCard({ dealer, className }: { dealer: Dealer; className?: string }) {
  return (
    <div data-slot="stat-card" className={cn('surface flex flex-col gap-3 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-foreground-secondary">Dealer account</p>
        {/* The badge is taller than a KPI icon; the negative margin keeps this row, and the card, the same height. */}
        <StatusBadge status={DEALER_STATUS[dealer.status]} className="-my-1" />
      </div>
      <p className="text-metric text-foreground">{DEALER_PLAN[dealer.plan].label} plan</p>
    </div>
  )
}
