import { ModulePlaceholder } from '@/components/common/module-placeholder'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { NAV_ITEMS } from '@/config/navigation'

const { label, description, icon } = NAV_ITEMS.settings

export function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title={label} description={description} />
      <ModulePlaceholder
        icon={icon}
        title="Settings module"
        description="Configuration for the admin portal itself."
        plannedCapabilities={[
          'Admin profile',
          'Team & roles',
          'Notification preferences',
          'API & integrations',
        ]}
      />
    </PageContainer>
  )
}
