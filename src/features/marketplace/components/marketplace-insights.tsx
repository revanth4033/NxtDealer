import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { SectionHeader } from '@/components/common/section-header'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { dealerDetailsPath } from '@/config/routes'
import { formatNumber } from '@/lib/format'
import type { MarketplaceInsights as Insights } from '@/types'

import { useDealerReturnState } from '../hooks/use-dealer-return-state'
import { useMarketplaceInsights } from '../hooks/use-marketplace-insights'
import { RankedBarList, RankedBarListSkeleton, type RankedBarItem } from './ranked-bar-list'

const TOP_DEALERS = 5

/**
 * Where the marketplace's listings come from: dealers, cities and makes, ranked by how many vehicles
 * each has published right now. Platform-wide, so unaffected by the directory filters below.
 */
export function MarketplaceInsights() {
  const insights = useMarketplaceInsights()

  return (
    <PageSection labelledBy="marketplace-insights">
      <SectionHeader
        id="marketplace-insights"
        title="Marketplace insights"
        description="Where currently published listings come from. Shares are of all published listings."
      />
      {insights.isError ? (
        <div className="surface">
          <EmptyState
            compact
            variant="error"
            title="Insights couldn’t be loaded"
            description="The marketplace service didn’t respond. Try again in a moment."
            action={
              <Button variant="outline" onClick={() => insights.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : (
        <InsightPanels data={insights.data} />
      )}
    </PageSection>
  )
}

function InsightPanels({ data }: { data: Insights | undefined }) {
  const returnState = useDealerReturnState()
  const total = data?.totals.publishedListings ?? 0
  const dealers: RankedBarItem[] = (data?.byDealer ?? []).map((row) => ({ ...row, href: dealerDetailsPath(row.key) }))

  // Two columns of roughly equal height: top dealers above makes, cities beside them.
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <InsightPanel
          id="insight-dealers"
          title="Top dealers"
          description="By published listings"
          action={data && dealers.length > TOP_DEALERS && <AllDealersDialog dealers={dealers} total={total} linkState={returnState} />}
        >
          {data ? (
            <RankedBarList
              items={dealers.slice(0, TOP_DEALERS)}
              total={total}
              label="Top dealers by published listings"
              showRank
              linkState={returnState}
            />
          ) : (
            <RankedBarListSkeleton rows={TOP_DEALERS} />
          )}
        </InsightPanel>
        <InsightPanel id="insight-makes" title="Listings by make" description={data && `${formatNumber(data.totals.makes)} makes`}>
          {data ? <RankedBarList items={data.byMake} total={total} label="Listings by vehicle make" /> : <RankedBarListSkeleton rows={6} />}
        </InsightPanel>
      </div>
      <InsightPanel
        id="insight-cities"
        title="Listings by city"
        description={data && `${formatNumber(data.totals.cities)} cities, by the dealer’s location`}
      >
        {data ? <RankedBarList items={data.byCity} total={total} label="Listings by city" /> : <RankedBarListSkeleton rows={10} />}
      </InsightPanel>
    </div>
  )
}

interface InsightPanelProps {
  id: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

function InsightPanel({ id, title, description, action, children }: InsightPanelProps) {
  return (
    <section aria-labelledby={id} className="surface flex flex-col gap-4 p-5">
      <SectionHeader as="h3" id={id} title={title} description={description} actions={action || undefined} />
      {children}
    </section>
  )
}

function AllDealersDialog({ dealers, total, linkState }: { dealers: RankedBarItem[]; total: number; linkState: unknown }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="-my-1 -mr-2 text-foreground-secondary">
          View all {formatNumber(dealers.length)}
          <ChevronRight aria-hidden data-icon="inline-end" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b p-5 pr-12">
          <DialogTitle className="text-section-title">All dealers with listings</DialogTitle>
          <DialogDescription>
            {formatNumber(dealers.length)} dealers, ranked by vehicles currently published. Shares are of{' '}
            {formatNumber(total)} listings.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto p-5">
          <RankedBarList items={dealers} total={total} label="All dealers by published listings" showRank linkState={linkState} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
