import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { NAV_ITEMS } from '@/config/navigation'
import { DealerDirectoryTable } from '@/features/dealers/components/dealer-directory-table'
import { DealerSummaryCards } from '@/features/dealers/components/dealer-summary-cards'
import { useDealerPopulation } from '@/features/dealers/hooks/use-dealers'
import { formatNumber } from '@/lib/format'

const { label, description } = NAV_ITEMS.dealers

/** Read-only directory of every dealer account. The only action is opening a dealer's details. */
export function DealersPage() {
  const population = useDealerPopulation()
  const total = population.data?.total

  return (
    <PageContainer>
      <PageHeader
        title={label}
        description={description}
        meta={
          total === undefined ? (
            population.isPending && <Skeleton className="h-6 w-24" />
          ) : (
            <span className="inline-flex h-6 items-center rounded-md bg-muted px-2 text-caption font-medium text-foreground-secondary tabular-nums">
              {formatNumber(total)} registered
            </span>
          )
        }
      />
      <DealerSummaryCards />
      <DealerDirectoryTable />
    </PageContainer>
  )
}
