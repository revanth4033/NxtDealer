import { ModulePlaceholder } from '@/components/common/module-placeholder'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { NAV_ITEMS } from '@/config/navigation'
import { useDealers } from '@/features/dealers/hooks/use-dealers'

const { label, description, icon } = NAV_ITEMS.dealers

export function DealersPage() {
  const dealers = useDealers()

  return (
    <PageContainer>
      <PageHeader title={label} description={description} />
      <ModulePlaceholder
        icon={icon}
        title="Dealers module"
        description="Searchable directory of every dealer on NxtDealer, with verification and activity insights."
        plannedCapabilities={[
          'Dealer directory table',
          'Status & plan filters',
          'Verification queue',
          'Dealer detail view',
          'Activity timeline',
          'Inventory overview',
        ]}
        connection={{
          entityLabel: 'dealers',
          count: dealers.data?.total,
          isLoading: dealers.isPending,
          isError: dealers.isError,
        }}
      />
    </PageContainer>
  )
}
