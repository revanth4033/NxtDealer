import { ModulePlaceholder } from '@/components/common/module-placeholder'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { NAV_ITEMS } from '@/config/navigation'
import { useMarketplaceVehicles } from '@/features/marketplace/hooks/use-marketplace-vehicles'

const { label, description, icon } = NAV_ITEMS.marketplace

export function MarketplacePage() {
  const listings = useMarketplaceVehicles()

  return (
    <PageContainer>
      <PageHeader title={label} description={description} />
      <ModulePlaceholder
        icon={icon}
        title="Marketplace module"
        description="All vehicle listings published through the NxtDealer app, with moderation and engagement data."
        plannedCapabilities={[
          'Listings table',
          'Moderation queue',
          'Price & category insights',
          'Views and lead tracking',
          'Listing detail view',
          'Flagged content review',
        ]}
        connection={{
          entityLabel: 'published vehicles',
          count: listings.data?.total,
          isLoading: listings.isPending,
          isError: listings.isError,
        }}
      />
    </PageContainer>
  )
}
