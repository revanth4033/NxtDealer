import { CarFront, MapPin, Store, Users } from 'lucide-react'

import { EmptyState } from '@/components/common/empty-state'
import { StatCard, StatCardSkeleton } from '@/components/common/stat-card'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/format'

import { useMarketplaceInsights } from '../hooks/use-marketplace-insights'

/** Headline marketplace counts, all computed from currently published vehicles: label, value and icon only. */
export function MarketplaceKpis() {
  const insights = useMarketplaceInsights()

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
          <StatCardSkeleton key={i} withContext={false} />
        ))}
      </div>
    )
  }

  const { totals } = insights.data

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Published listings" value={formatNumber(totals.publishedListings)} icon={Store} />
      <StatCard label="Dealers with listings" value={formatNumber(totals.dealersWithListings)} icon={Users} />
      <StatCard label="Cities" value={formatNumber(totals.cities)} icon={MapPin} />
      <StatCard label="Vehicle makes" value={formatNumber(totals.makes)} icon={CarFront} />
    </div>
  )
}
