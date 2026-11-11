import { ArrowLeft, UserSearch, Users } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'

import { EmptyState } from '@/components/common/empty-state'
import { ModulePlaceholder } from '@/components/common/module-placeholder'
import { StatusBadge } from '@/components/common/status-badge'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/config/routes'
import { DEALER_STATUS } from '@/config/status'
import type { DealerDirectoryLinkState } from '@/features/dealers/components/dealer-directory-columns'
import { useDealer } from '@/features/dealers/hooks/use-dealers'
import { useDealerShowrooms } from '@/features/dealers/hooks/use-showrooms'
import { isApiError } from '@/services'

/**
 * Placeholder for the individual dealer page (designed in the next phase).
 * Resolves the dealer from the URL and handles unknown ids; the full read-only profile comes later.
 */
export function DealerDetailsPage() {
  const { dealerId } = useParams()
  const location = useLocation()
  const dealer = useDealer(dealerId)
  const showrooms = useDealerShowrooms(dealer.data?.id)

  // Return to the directory with the same search, filters, sort and page the admin left.
  const directorySearch = (location.state as DealerDirectoryLinkState | null)?.directorySearch ?? ''
  const backLink = (
    <Button variant="ghost" asChild className="-ml-3 w-fit text-foreground-secondary">
      <Link to={`${ROUTES.dealers}${directorySearch}`}>
        <ArrowLeft /> All dealers
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
        <div aria-busy className="flex flex-col gap-3 border-b pb-6">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </PageContainer>
    )
  }

  const { businessName, ownerName, location: dealerLocation, status, id } = dealer.data

  return (
    <PageContainer>
      {backLink}
      <PageHeader
        title={businessName}
        meta={<StatusBadge status={DEALER_STATUS[status]} />}
        description={`Owned by ${ownerName}, ${dealerLocation.city}, ${dealerLocation.state}. Dealer ID ${id}.`}
      />
      <ModulePlaceholder
        icon={Users}
        title="Dealer details"
        description="A read-only view of this dealer’s account, showrooms and inventory is on the way."
        plannedCapabilities={[
          'Account details',
          'Showrooms',
          'Garage inventory',
          'Marketplace vehicles',
          'AI reels',
          'Recent activity',
        ]}
        connection={{
          entityLabel: showrooms.data?.length === 1 ? 'showroom' : 'showrooms',
          count: showrooms.data?.length,
          isLoading: showrooms.isPending,
          isError: showrooms.isError,
        }}
      />
    </PageContainer>
  )
}
