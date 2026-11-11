import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { Sparkline } from './sparkline'
import { TrendIndicator } from './trend-indicator'

export interface StatCardProps {
  label: string
  /** Pre-formatted value, e.g. formatNumber(1240) or formatMoney(...) */
  value: ReactNode
  icon?: LucideIcon
  /** Fractional change vs. the comparison period. */
  changeRatio?: number
  betterWhen?: 'higher' | 'lower'
  /** e.g. "vs last 30 days" */
  comparisonLabel?: string
  trend?: number[]
  className?: string
}

/** KPI tile: label, headline figure, change vs. previous period and an optional sparkline. */
export function StatCard({
  label,
  value,
  icon: Icon,
  changeRatio,
  betterWhen,
  comparisonLabel = 'vs previous period',
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn('flex flex-col gap-4 surface p-5', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-foreground-secondary">{label}</p>
        {Icon && <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <p className="text-metric text-foreground tabular-nums">{value}</p>
          {changeRatio !== undefined && (
            <p className="flex flex-wrap items-center gap-x-1.5 text-caption text-muted-foreground">
              <TrendIndicator changeRatio={changeRatio} betterWhen={betterWhen} />
              <span>{comparisonLabel}</span>
            </p>
          )}
        </div>
        {trend && <Sparkline values={trend} className="shrink-0 text-foreground-secondary/70" />}
      </div>
    </div>
  )
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('flex flex-col gap-4 surface p-5', className)}
    >
      <Skeleton className="h-4 w-28" />
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3.5 w-36" />
      </div>
    </div>
  )
}
