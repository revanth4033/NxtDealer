import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LoadingStateProps {
  /** What is loading, e.g. "Loading dealers". Announced to screen readers. */
  label?: string
  compact?: boolean
  className?: string
}

/**
 * Indeterminate loading indicator for regions whose shape is unknown.
 * Prefer skeletons (StatCardSkeleton, DataTable's built-in rows) when the final layout is known.
 */
export function LoadingState({ label = 'Loading', compact = false, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-2.5 text-sm text-muted-foreground',
        compact ? 'py-8' : 'py-20',
        className,
      )}
    >
      <Loader2 aria-hidden className="size-4 animate-spin text-primary" />
      <span>{label}…</span>
    </div>
  )
}

/** Inline spinner for buttons and small refresh indicators. */
export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <Loader2
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('size-4 animate-spin', className)}
    />
  )
}
