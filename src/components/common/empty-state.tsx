import { AlertCircle, Inbox, SearchX, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EmptyStateVariant = 'empty' | 'no-results' | 'error'

const VARIANT_ICONS: Record<EmptyStateVariant, LucideIcon> = {
  empty: Inbox,
  'no-results': SearchX,
  error: AlertCircle,
}

interface EmptyStateProps {
  title: string
  description?: string
  /**
   * empty: nothing exists yet · no-results: filters exclude everything · error: data failed to load
   */
  variant?: EmptyStateVariant
  icon?: LucideIcon
  /** Next step for the user, e.g. a "Clear filters" or "Try again" button. */
  action?: ReactNode
  /** Smaller vertical padding for use inside tables and cards. */
  compact?: boolean
  className?: string
}

/** Placeholder shown when a region has no content. Always explains why and, where possible, what to do next. */
export function EmptyState({
  title,
  description,
  variant = 'empty',
  icon,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  const Icon = icon ?? VARIANT_ICONS[variant]

  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 text-center',
        compact ? 'py-12' : 'py-20',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-10 place-items-center rounded-lg border',
          variant === 'error' ? 'border-destructive/20 bg-danger-soft text-destructive' : 'bg-card text-muted-foreground shadow-card',
        )}
      >
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <div className="max-w-sm space-y-1">
        <p className="text-section-title text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  )
}
