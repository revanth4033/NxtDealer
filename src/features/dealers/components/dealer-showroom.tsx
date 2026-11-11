import { MapPin, Phone, Store, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { EmptyState } from '@/components/common/empty-state'
import { SectionHeader } from '@/components/common/section-header'
import { StatusBadge } from '@/components/common/status-badge'
import { PageSection } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SHOWROOM_STATUS } from '@/config/status'
import type { Dealer, Showroom } from '@/types'

import { useDealerShowrooms } from '../hooks/use-showrooms'
import { currentShowroom } from '../showrooms'

/** The dealer's showroom, as entered in the app. Read-only: dealers edit, suspend or delete it in the app. */
export function DealerShowroom({ dealer }: { dealer: Dealer }) {
  const showrooms = useDealerShowrooms(dealer.id)
  const showroom = showrooms.data ? currentShowroom(showrooms.data) : undefined

  return (
    <PageSection labelledBy="dealer-showroom">
      <SectionHeader id="dealer-showroom" title="Showroom" description="Where the dealer sells from, as set in the app." />
      {showrooms.isPending ? (
        <div aria-busy className="surface space-y-4 p-5">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : showrooms.isError ? (
        <div className="surface">
          <EmptyState
            compact
            variant="error"
            title="Showroom couldn’t be loaded"
            description="The showroom service didn’t respond. Try again in a moment."
            action={
              <Button variant="outline" onClick={() => showrooms.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : showroom ? (
        <ShowroomCard showroom={showroom} />
      ) : (
        <div className="surface">
          <EmptyState
            compact
            icon={Store}
            title="No showroom added"
            description={`${dealer.businessName} hasn’t added showroom details in the app yet.`}
          />
        </div>
      )}
    </PageSection>
  )
}

/** One showroom. Self-contained so a future multi-branch dealer can render a grid of these. */
function ShowroomCard({ showroom }: { showroom: Showroom }) {
  return (
    <article aria-label={showroom.name} className="surface flex flex-col">
      <header className="flex items-start gap-3 border-b px-5 py-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
          <Store aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="font-semibold text-foreground">{showroom.name}</h3>
          <p className="text-caption text-muted-foreground">{showroom.city}</p>
        </div>
        <StatusBadge status={SHOWROOM_STATUS[showroom.status]} />
      </header>
      <dl className="space-y-3.5 px-5 py-4">
        <ShowroomField icon={Phone} term="Contact number">
          <span className="tabular-nums">{showroom.contactNumber}</span>
        </ShowroomField>
        <ShowroomField icon={MapPin} term="Address">
          {showroom.address}
        </ShowroomField>
      </dl>
    </article>
  )
}

function ShowroomField({ icon: Icon, term, children }: { icon: LucideIcon; term: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <div className="min-w-0 space-y-0.5">
        <dt className="text-caption text-muted-foreground">{term}</dt>
        <dd className="text-foreground">{children}</dd>
      </div>
    </div>
  )
}
