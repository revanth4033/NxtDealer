import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface StatMeter {
  value: number
  max: number
  /** Text shown beside the bar, e.g. "45% of garage". The bar never carries meaning alone. */
  label: string
}

export interface StatCardProps {
  label: string
  /** Pre-formatted value, e.g. formatNumber(1240). */
  value: ReactNode
  icon?: LucideIcon
  /** One line of supporting context derived from real data, e.g. "17 active · 3 pending". */
  context?: ReactNode
  /** Optional part-of-whole indicator. */
  meter?: StatMeter
  className?: string
}

/** KPI tile: label, headline figure, supporting context and an optional part-of-whole meter. */
export function StatCard({ label, value, icon: Icon, context, meter, className }: StatCardProps) {
  return (
    <div data-slot="stat-card" className={cn('surface flex flex-col gap-3 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-foreground-secondary">{label}</p>
        {Icon && <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
      </div>
      <p className="text-metric text-foreground tabular-nums">{value}</p>
      <div className="mt-auto flex flex-col gap-2">
        {context && <div className="text-caption text-muted-foreground">{context}</div>}
        {meter && <Meter {...meter} />}
      </div>
    </div>
  )
}

function Meter({ value, max, label }: StatMeter) {
  const percent = max === 0 ? 0 : Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={label}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
      <span className="shrink-0 text-caption font-medium text-foreground-secondary tabular-nums">{label}</span>
    </div>
  )
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('surface flex flex-col gap-3 p-5', className)}>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="mt-auto h-3.5 w-36" />
    </div>
  )
}
