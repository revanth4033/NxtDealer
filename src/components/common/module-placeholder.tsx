import { CheckCircle2, CircleDashed, type LucideIcon } from 'lucide-react'
import { useId } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'

export interface DataConnectionStatus {
  /** e.g. "dealers" → "26 dealers loaded" */
  entityLabel: string
  count: number | undefined
  isLoading: boolean
  isError: boolean
}

interface ModulePlaceholderProps {
  icon: LucideIcon
  title: string
  description: string
  plannedCapabilities: string[]
  connection?: DataConnectionStatus
}

/**
 * Temporary surface for routes whose UI has not been designed yet.
 * Lists what the module will contain and proves the data layer is wired end-to-end.
 */
export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  plannedCapabilities,
  connection,
}: ModulePlaceholderProps) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className="overflow-hidden surface">
      <div className="flex items-start gap-4 px-6 pt-6 pb-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
          <Icon aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <div className="space-y-1">
          <h2 id={titleId} className="text-section-title text-foreground">
            {title}
          </h2>
          <p className="max-w-prose text-foreground-secondary">{description}</p>
        </div>
      </div>

      <div className="grid gap-6 border-t px-6 py-5 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <h3 className="text-caption font-medium text-muted-foreground">Planned for this module</h3>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {plannedCapabilities.map((capability) => (
              <li key={capability} className="flex items-center gap-2 text-foreground-secondary">
                <CircleDashed aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                {capability}
              </li>
            ))}
          </ul>
        </div>

        {connection && <ConnectionStatus {...connection} />}
      </div>
    </section>
  )
}

function ConnectionStatus({ entityLabel, count, isLoading, isError }: DataConnectionStatus) {
  return (
    <div className="flex min-w-56 flex-col justify-center gap-1.5 rounded-lg border border-dashed bg-muted/50 px-4 py-3">
      <p className="text-caption font-medium text-muted-foreground">Data layer</p>
      {isLoading ? (
        <Skeleton className="h-5 w-40" />
      ) : isError ? (
        <p className="font-medium text-destructive">Service unavailable</p>
      ) : (
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <CheckCircle2 aria-hidden className="size-4 text-success" strokeWidth={2} />
          <span>
            <span className="tabular-nums">{formatNumber(count ?? 0)}</span> {entityLabel} loaded
          </span>
        </p>
      )}
    </div>
  )
}
