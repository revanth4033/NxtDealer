import { ModulePlaceholder } from '@/components/common/module-placeholder'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { NAV_ITEMS } from '@/config/navigation'
import { useAiReels } from '@/features/ai-reels/hooks/use-ai-reels'

const { label, description, icon } = NAV_ITEMS.aiReels

export function AiReelsPage() {
  const reels = useAiReels()

  return (
    <PageContainer>
      <PageHeader title={label} description={description} />
      <ModulePlaceholder
        icon={icon}
        title="AI Reels module"
        description="Monitor the AI reel generation pipeline and how generated reels perform for dealers."
        plannedCapabilities={[
          'Generation queue status',
          'Failure diagnostics',
          'Reel performance metrics',
          'Reel gallery',
          'Per-dealer usage',
          'Processing time trends',
        ]}
        connection={{
          entityLabel: 'reels',
          count: reels.data?.total,
          isLoading: reels.isPending,
          isError: reels.isError,
        }}
      />
    </PageContainer>
  )
}
