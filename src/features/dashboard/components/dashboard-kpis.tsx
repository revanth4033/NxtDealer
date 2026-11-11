import { CarFront, Clapperboard, Store, Users } from 'lucide-react'

import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { DealerProfileCard } from '@/features/dealers/components/dealer-profile-card'
import { formatNumber, formatShare } from '@/lib/format'
import type { DashboardSummary, Dealer } from '@/types'

interface DashboardKpisProps {
  summary: DashboardSummary | undefined
  /** Set when a single dealer is in focus. */
  dealer: Dealer | undefined
  isLoading: boolean
}

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

/**
 * Four headline figures. Marketplace vehicles are shown as a share of garage vehicles —
 * they are a subset, never an addition.
 */
export function DashboardKpis({ summary, dealer, isLoading }: DashboardKpisProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const { totals } = summary
  const marketplaceMeter = {
    value: totals.marketplaceVehicles,
    max: totals.garageVehicles,
    label: `${formatShare(totals.marketplaceVehicles, totals.garageVehicles)} of garage`,
  }
  const reelContext =
    totals.aiReels === 0 ? 'No reels created yet' : `Covering ${plural(totals.vehiclesWithReels, 'vehicle', 'vehicles')}`

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dealer ? (
        <>
          <StatCard
            label="Dealer vehicles"
            value={formatNumber(totals.garageVehicles)}
            icon={CarFront}
            context={totals.garageVehicles === 0 ? 'Garage is empty' : `${formatNumber(totals.unpublishedVehicles)} not published`}
          />
          <StatCard
            label="Marketplace vehicles"
            value={formatNumber(totals.marketplaceVehicles)}
            icon={Store}
            context={
              totals.garageVehicles === 0
                ? 'Nothing in the garage to publish'
                : `Of ${plural(totals.garageVehicles, 'garage vehicle', 'garage vehicles')}`
            }
            // A share of an empty garage is meaningless, so the meter only appears when there is inventory.
            meter={totals.garageVehicles > 0 ? marketplaceMeter : undefined}
          />
          <StatCard label="AI reels created" value={formatNumber(totals.aiReels)} icon={Clapperboard} context={reelContext} />
          <DealerProfileCard dealer={dealer} />
        </>
      ) : (
        <>
          <StatCard
            label="Total dealers"
            value={formatNumber(summary.dealers?.total ?? 0)}
            icon={Users}
            context={
              summary.dealers && (
                <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>
                    <span className="font-medium text-success">{summary.dealers.byStatus.active}</span> active
                  </span>
                  <span>
                    <span className="font-medium text-warning">{summary.dealers.byStatus.pending}</span> pending
                  </span>
                  <span>
                    {summary.dealers.byStatus.suspended + summary.dealers.byStatus.inactive} inactive or suspended
                  </span>
                </span>
              )
            }
          />
          <StatCard
            label="Total vehicles"
            value={formatNumber(totals.garageVehicles)}
            icon={CarFront}
            context={`In ${plural(summary.dealers?.withGarageVehicles ?? 0, 'dealer garage', 'dealer garages')}`}
          />
          <StatCard
            label="Marketplace vehicles"
            value={formatNumber(totals.marketplaceVehicles)}
            icon={Store}
            context={`Published by ${plural(summary.dealers?.withMarketplaceVehicles ?? 0, 'dealer', 'dealers')}`}
            meter={marketplaceMeter}
          />
          <StatCard label="AI reels created" value={formatNumber(totals.aiReels)} icon={Clapperboard} context={reelContext} />
        </>
      )}
    </div>
  )
}
