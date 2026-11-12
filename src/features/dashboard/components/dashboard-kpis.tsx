import { CarFront, Clapperboard, Store, Users } from 'lucide-react'

import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { DealerProfileCard } from '@/features/dealers/components/dealer-profile-card'
import { formatNumber } from '@/lib/format'
import type { DashboardSummary, Dealer } from '@/types'

interface DashboardKpisProps {
  summary: DashboardSummary | undefined
  /** Set when a single dealer is in focus. */
  dealer: Dealer | undefined
  isLoading: boolean
}

/**
 * Four headline cards, label and value only: platform totals, or one dealer's totals plus their account card.
 * Marketplace vehicles are a subset of garage vehicles, never an addition.
 */
export function DashboardKpis({ summary, dealer, isLoading }: DashboardKpisProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} withContext={false} />
        ))}
      </div>
    )
  }

  const { totals } = summary

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dealer ? (
        <>
          <StatCard label="Dealer vehicles" value={formatNumber(totals.garageVehicles)} icon={CarFront} />
          <StatCard label="Marketplace vehicles" value={formatNumber(totals.marketplaceVehicles)} icon={Store} />
          <StatCard label="AI reels created" value={formatNumber(totals.aiReels)} icon={Clapperboard} />
          <DealerProfileCard dealer={dealer} />
        </>
      ) : (
        <>
          <StatCard label="Total dealers" value={formatNumber(summary.dealers?.total ?? 0)} icon={Users} />
          <StatCard label="Total vehicles" value={formatNumber(totals.garageVehicles)} icon={CarFront} />
          <StatCard label="Marketplace vehicles" value={formatNumber(totals.marketplaceVehicles)} icon={Store} />
          <StatCard label="AI reels created" value={formatNumber(totals.aiReels)} icon={Clapperboard} />
        </>
      )}
    </div>
  )
}
