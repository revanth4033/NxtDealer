import { CheckCircle2, CircleDashed, type LucideIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'

export interface DataConnectionStatus {
  /** e.g. "dealers" → "8 dealers available from the mock service" */
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
 * Shows what the module will contain and proves the data layer is wired end-to-end.
 */
export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  plannedCapabilities,
  connection,
}: ModulePlaceholderProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex items-start gap-4 px-6 pt-6 pb-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="space-y-1">
          <CardTitle className="text-section-title font-semibold">{title}</CardTitle>
          <CardDescription className="max-w-prose text-foreground-secondary">{description}</CardDescription>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="grid gap-6 px-6 py-5 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <p className="text-overline uppercase text-muted-foreground">Planned for this module</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {plannedCapabilities.map((capability) => (
              <li key={capability} className="flex items-center gap-2 text-foreground-secondary">
                <CircleDashed className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                {capability}
              </li>
            ))}
          </ul>
        </div>

        {connection && <ConnectionStatus {...connection} />}
      </CardContent>
    </Card>
  )
}

function ConnectionStatus({ entityLabel, count, isLoading, isError }: DataConnectionStatus) {
  return (
    <div className="flex min-w-56 flex-col justify-center gap-1.5 rounded-lg border border-dashed bg-muted/50 px-4 py-3">
      <p className="text-overline uppercase text-muted-foreground">Data layer</p>
      {isLoading ? (
        <Skeleton className="h-5 w-40" />
      ) : isError ? (
        <p className="font-medium text-destructive">Service unavailable</p>
      ) : (
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <CheckCircle2 className="size-4 text-success" strokeWidth={2} />
          <span>
            <span className="tabular-nums">{formatNumber(count ?? 0)}</span> {entityLabel} loaded
          </span>
        </p>
      )}
    </div>
  )
}
