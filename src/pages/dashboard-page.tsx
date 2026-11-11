import { ModulePlaceholder } from '@/components/common/module-placeholder'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { NAV_ITEMS } from '@/config/navigation'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'

const { label, description, icon } = NAV_ITEMS.dashboard

export function DashboardPage() {
  const summary = useDashboardSummary()

  return (
    <PageContainer>
      <PageHeader title={label} description={description} />
      <ModulePlaceholder
        icon={icon}
        title="Dashboard module"
        description="Ecosystem KPIs, growth trends and operational alerts across dealers, marketplace and AI reels."
        plannedCapabilities={[
          'KPI summary cards',
          'Dealer growth trend',
          'Marketplace activity chart',
          'AI reel pipeline health',
          'Recent activity feed',
          'Attention-needed alerts',
        ]}
        connection={{
          entityLabel: 'metrics',
          count: summary.data?.metrics.length,
          isLoading: summary.isPending,
          isError: summary.isError,
        }}
      />
    </PageContainer>
  )
}
