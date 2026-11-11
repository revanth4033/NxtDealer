import { Store, UserCheck, Users, UserX } from 'lucide-react'

import { EmptyState } from '@/components/common/empty-state'
import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { Button } from '@/components/ui/button'
import { formatNumber, formatShare } from '@/lib/format'

import { useDealerPopulation } from '../hooks/use-dealers'

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

/**
 * Account-status breakdown of every registered dealer: active + suspended = total dealers.
 * The fourth card counts dealers with at least one vehicle currently published to the marketplace. Unaffected by directory filters.
 */
export function DealerSummaryCards() {
  const population = useDealerPopulation()

  if (population.isError) {
    return (
      <div className="surface">
        <EmptyState
          compact
          variant="error"
          title="Dealer totals couldn’t be loaded"
          description="The analytics service didn’t respond. Try again in a moment."
          action={
            <Button variant="outline" onClick={() => population.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  const dealers = population.data
  if (!dealers) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const { total, byStatus } = dealers

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total dealers"
        value={formatNumber(total)}
        icon={Users}
        context={`${plural(dealers.withGarageVehicles, 'has', 'have')} vehicles in their garage`}
      />
      <StatCard
        label="Active dealers"
        value={formatNumber(byStatus.active)}
        icon={UserCheck}
        meter={{ value: byStatus.active, max: total, label: `${formatShare(byStatus.active, total)} of dealers` }}
      />
      <StatCard
        label="Suspended dealers"
        value={formatNumber(byStatus.suspended)}
        icon={UserX}
        context={`${formatShare(byStatus.suspended, total)} of dealers`}
      />
      <StatCard
        label="Dealers with listings"
        value={formatNumber(dealers.withMarketplaceVehicles)}
        icon={Store}
        context="Have at least one published vehicle"
      />
    </div>
  )
}
