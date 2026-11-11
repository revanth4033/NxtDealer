import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NAV_ITEMS } from '@/config/navigation'
import { useUrlState } from '@/hooks/use-url-state'

import { DataDisplaySection } from './data-display-section'
import { FeedbackSection } from './feedback-section'
import { InputsSection } from './inputs-section'

const VIEWS = [
  { value: 'data', label: 'Data display' },
  { value: 'inputs', label: 'Inputs and navigation' },
  { value: 'feedback', label: 'Status and feedback' },
] as const

type View = (typeof VIEWS)[number]['value']
const isView = (value: string | undefined): value is View => VIEWS.some((view) => view.value === value)

const { label, description } = NAV_ITEMS.uiKit

/** Development-only reference for shared components, wired to mock services. */
export function UiKitPage() {
  const url = useUrlState()
  const requested = url.get('view')
  const view: View = isView(requested) ? requested : 'data'

  return (
    <Tabs
      value={view}
      // Switching views starts from a clean URL so one view's filters don't leak into another.
      onValueChange={(next) => url.update({ view: next === 'data' ? null : next, q: null, status: null, plan: null, page: null, size: null, sort: null }, { replace: false })}
      className="gap-0"
    >
      <PageContainer>
        <PageHeader title={label} description={description}>
          <TabsList aria-label="Component groups">
            {VIEWS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </PageHeader>
        <TabsContent value="data">
          <DataDisplaySection />
        </TabsContent>
        <TabsContent value="inputs">
          <InputsSection />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackSection />
        </TabsContent>
      </PageContainer>
    </Tabs>
  )
}
