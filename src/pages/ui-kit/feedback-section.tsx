import { Link } from 'react-router'

import { EmptyState } from '@/components/common/empty-state'
import { LoadingState, Spinner } from '@/components/common/loading-state'
import { SectionHeader } from '@/components/common/section-header'
import { StatCardSkeleton } from '@/components/common/stat-card'
import { StatusBadge } from '@/components/common/status-badge'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import {
  DEALER_PLAN,
  DEALER_STATUS,
  DEALER_VERIFICATION,
  MARKETPLACE_STATUS,
  type StatusMeta,
} from '@/config/status'
import { ROUTES } from '@/config/routes'

const STATUS_GROUPS: { title: string; map: Record<string, StatusMeta>; hideDot?: boolean }[] = [
  { title: 'Dealer status', map: DEALER_STATUS },
  { title: 'Verification', map: DEALER_VERIFICATION },
  { title: 'Marketplace', map: MARKETPLACE_STATUS },
  { title: 'Plan', map: DEALER_PLAN, hideDot: true },
]

/** Status, empty and loading presentations. */
export function FeedbackSection() {
  return (
    <div className="flex flex-col gap-10">
      <PageSection labelledBy="kit-status">
        <SectionHeader
          id="kit-status"
          title="Status badges"
          description="Every domain status has one label and one tone, defined in config/status.ts. Colour is always paired with text."
        />
        <div className="overflow-hidden surface">
          <dl className="divide-y">
            {STATUS_GROUPS.map((group) => (
              <div key={group.title} className="grid gap-3 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:items-center">
                <dt className="text-sm font-medium text-foreground-secondary">{group.title}</dt>
                <dd className="flex flex-wrap gap-2">
                  {Object.values(group.map).map((meta) => (
                    <StatusBadge key={meta.label} status={meta} hideDot={group.hideDot} />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </PageSection>

      <PageSection labelledBy="kit-empty">
        <SectionHeader
          id="kit-empty"
          title="Empty states"
          description="Say why the area is empty and offer the next step."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="surface">
            <EmptyState
              compact
              title="No AI reels yet"
              description="Reels appear here once dealers generate them from a listing."
            />
          </div>
          <div className="surface">
            <EmptyState
              compact
              variant="no-results"
              title="No listings match"
              description="Try another search term or remove a filter."
              action={
                <Button variant="outline" asChild>
                  <Link to={`${ROUTES.uiKit}?view=data`}>Open the data table demo</Link>
                </Button>
              }
            />
          </div>
          <div className="surface">
            <EmptyState
              compact
              variant="error"
              title="Listings couldn’t be loaded"
              description="The marketplace service didn’t respond. Try again in a moment."
            />
          </div>
        </div>
      </PageSection>

      <PageSection labelledBy="kit-loading">
        <SectionHeader
          id="kit-loading"
          title="Loading states"
          description="Use skeletons when the final layout is known; the spinner only when it isn’t."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <StatCardSkeleton />
          <div className="surface">
            <LoadingState compact label="Loading activity" />
          </div>
          <div className="flex items-center justify-center gap-3 surface p-5">
            <Button disabled>
              <Spinner /> Saving
            </Button>
          </div>
        </div>
      </PageSection>
    </div>
  )
}
