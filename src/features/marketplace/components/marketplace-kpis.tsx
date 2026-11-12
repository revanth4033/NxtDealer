import { CarFront, MapPin, Store, Users } from 'lucide-react'

import { EmptyState } from '@/components/common/empty-state'
import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { Button } from '@/components/ui/button'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'
import { formatNumber, formatShare } from '@/lib/format'

import { useMarketplaceInsights } from '../hooks/use-marketplace-insights'

/**
 * Headline marketplace counts, all computed from currently published vehicles. Garage and dealer
 * totals come from the platform summary the Dashboard and Dealers pages already share.
 */
export function MarketplaceKpis() {
  const insights = useMarketplaceInsights()
  const summary = useDashboardSummary()

  if (insights.isError) {
    return (
      <div className="surface">
        <EmptyState
          compact
          variant="error"
          title="Marketplace totals couldn’t be loaded"
          description="The marketplace service didn’t respond. Try again in a moment."
          action={
            <Button variant="outline" onClick={() => insights.refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!insights.data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const { totals, byMake } = insights.data
  const garage = summary.data?.totals.garageVehicles
  const dealers = summary.data?.dealers?.total
  const topMake = byMake[0]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Published listings"
        value={formatNumber(totals.publishedListings)}
        icon={Store}
        context={garage === undefined && 'Vehicles currently on the marketplace'}
        meter={
          garage === undefined
            ? undefined
            : { value: totals.publishedListings, max: garage, label: `${formatShare(totals.publishedListings, garage)} of garage vehicles` }
        }
      />
      <StatCard
        label="Dealers with listings"
        value={formatNumber(totals.dealersWithListings)}
        icon={Users}
        context={
          dealers === undefined
            ? 'Have at least one published vehicle'
            : `Of ${formatNumber(dealers)} registered dealers`
        }
      />
      <StatCard label="Cities" value={formatNumber(totals.cities)} icon={MapPin} context="Where dealers with listings are based" />
      <StatCard
        label="Vehicle makes"
        value={formatNumber(totals.makes)}
        icon={CarFront}
        context={topMake && `Most listed: ${topMake.label} (${formatNumber(topMake.count)})`}
      />
    </div>
  )
}
