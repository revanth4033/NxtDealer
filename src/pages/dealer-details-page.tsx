import { ArrowLeft, UserSearch } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import { EmptyState } from '@/components/common/empty-state'
import { SectionHeader } from '@/components/common/section-header'
import { PageContainer, PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { DealerReelGallery } from '@/features/ai-reels/components/dealer-reel-gallery'
import { ReelPreviewDialog } from '@/features/ai-reels/components/reel-preview-dialog'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'
import { DealerActivityKpis } from '@/features/dealers/components/dealer-activity-kpis'
import { DealerInformation } from '@/features/dealers/components/dealer-information'
import { DealerProfileHeader } from '@/features/dealers/components/dealer-profile-header'
import { DealerShowroom } from '@/features/dealers/components/dealer-showroom'
import { readDealerLinkState } from '@/features/dealers/dealer-link-state'
import { useDealer } from '@/features/dealers/hooks/use-dealers'
import { DealerGarageTable } from '@/features/garage/components/dealer-garage-table'
import { VehicleDetailSheet } from '@/features/garage/components/vehicle-detail-sheet'
import { DealerMarketplaceListings } from '@/features/marketplace/components/dealer-marketplace-listings'
import { usePageMeta } from '@/hooks/use-page-meta'
import { formatNumber } from '@/lib/format'
import { isApiError } from '@/services'
import type { AiReel, Dealer, GarageVehicle } from '@/types'

const plural = (count: number, one: string, many: string) => `${formatNumber(count)} ${count === 1 ? one : many}`

/**
 * One dealer's account, showroom, garage, marketplace listings and AI reels. Strictly read-only:
 * the only interactions are navigation, filtering, search and previews.
 */
export function DealerDetailsPage() {
  const { dealerId } = useParams()
  const location = useLocation()
  const dealer = useDealer(dealerId)

  // Return to the directory with the same search, filters, sort and page the admin left, or to the
  // page that linked here (e.g. a filtered Marketplace view). The breadcrumb always leads to Dealers.
  const linkState = readDealerLinkState(location.state)
  const directoryPath = `${ROUTES.dealers}${linkState.directorySearch ?? ''}`
  const back = linkState.returnTo ?? { path: directoryPath, label: 'All dealers' }
  usePageMeta({ title: dealer.data?.businessName, parentPath: directoryPath })

  const backLink = (
    <Button variant="ghost" asChild className="-ml-3 w-fit text-foreground-secondary">
      <Link to={back.path}>
        <ArrowLeft /> {back.label}
      </Link>
    </Button>
  )

  if (dealer.isError) {
    const notFound = isApiError(dealer.error) && dealer.error.status === 404
    return (
      <PageContainer>
        {backLink}
        <div className="surface">
          {notFound ? (
            <EmptyState
              icon={UserSearch}
              title="Dealer not found"
              description={`No dealer account matches the ID “${dealerId}”. The link may be mistyped, or the account may no longer exist.`}
              action={
                <Button asChild variant="outline">
                  <Link to={ROUTES.dealers}>Browse all dealers</Link>
                </Button>
              }
            />
          ) : (
            <EmptyState
              variant="error"
              title="Dealer couldn’t be loaded"
              description="The dealer service didn’t respond. Try again in a moment."
              action={
                <Button variant="outline" onClick={() => dealer.refetch()}>
                  Try again
                </Button>
              }
            />
          )}
        </div>
      </PageContainer>
    )
  }

  if (!dealer.data) {
    return (
      <PageContainer>
        {backLink}
        <div aria-busy className="flex items-center gap-5 border-b pb-6">
          <Skeleton className="size-14 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-36 w-full rounded-xl" />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {backLink}
      <DealerDetails key={dealer.data.id} dealer={dealer.data} />
    </PageContainer>
  )
}

function DealerDetails({ dealer }: { dealer: Dealer }) {
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const [reel, setReel] = useState<AiReel | null>(null)
  const selectVehicle = useCallback((vehicle: GarageVehicle) => setVehicleId(vehicle.id), [])

  // Same analytics totals as the Dashboard's dealer scope, so both pages always agree.
  const summary = useDashboardSummary(dealer.id)
  const totals = summary.data?.totals

  return (
    <>
      <DealerProfileHeader dealer={dealer} />
      <DealerActivityKpis totals={totals} />

      <div className="grid items-start gap-section xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <DealerInformation dealer={dealer} />
        <DealerShowroom dealer={dealer} />
      </div>

      <PageSection labelledBy="dealer-garage">
        <SectionHeader
          id="dealer-garage"
          title="Garage inventory"
          description="Every vehicle in the dealer’s garage. Published vehicles also appear on the marketplace."
        />
        <DealerGarageTable dealer={dealer} totals={totals} onSelectVehicle={selectVehicle} />
      </PageSection>

      <PageSection labelledBy="dealer-marketplace">
        <SectionHeader
          id="dealer-marketplace"
          title="Marketplace listings"
          description="Vehicles from this garage that are currently published to the shared marketplace."
          actions={
            totals && (
              <span className="text-caption text-muted-foreground tabular-nums">
                {plural(totals.marketplaceVehicles, 'listing', 'listings')}
              </span>
            )
          }
        />
        <DealerMarketplaceListings dealer={dealer} onSelectVehicle={selectVehicle} />
      </PageSection>

      <PageSection labelledBy="dealer-reels">
        <SectionHeader
          id="dealer-reels"
          title="AI reels"
          description="Promotional videos created by the dealer using vehicle photos."
        />
        <DealerReelGallery dealer={dealer} onPlayReel={setReel} />
      </PageSection>

      <VehicleDetailSheet vehicleId={vehicleId} onOpenChange={(open) => !open && setVehicleId(null)} onPlayReel={setReel} />
      <ReelPreviewDialog
        reel={reel}
        onOpenChange={(open) => !open && setReel(null)}
        onViewVehicle={(id) => {
          setReel(null)
          setVehicleId(id)
        }}
      />
    </>
  )
}
