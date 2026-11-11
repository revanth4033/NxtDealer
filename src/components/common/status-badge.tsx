import type { StatusMeta, StatusTone } from '@/config/status'
import { cn } from '@/lib/utils'

const TONE_STYLES: Record<StatusTone, { badge: string; dot: string }> = {
  neutral: { badge: 'bg-muted text-foreground-secondary', dot: 'bg-neutral-400' },
  brand: { badge: 'bg-accent text-accent-foreground', dot: 'bg-primary' },
  success: { badge: 'bg-success-soft text-success', dot: 'bg-success' },
  warning: { badge: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  danger: { badge: 'bg-danger-soft text-destructive', dot: 'bg-destructive' },
  info: { badge: 'bg-info-soft text-info', dot: 'bg-info' },
}

type StatusBadgeProps = (StatusMeta | { status: StatusMeta }) & {
  /** Hide the leading dot, e.g. for plan/tier labels that are not states. */
  hideDot?: boolean
  className?: string
}

/**
 * Compact status label. Colour is always paired with text (and a dot), never used alone.
 * Pass a StatusMeta from config/status.ts: <StatusBadge status={DEALER_STATUS[dealer.status]} />
 */
export function StatusBadge(props: StatusBadgeProps) {
  const { label, tone } = 'status' in props ? props.status : props
  const styles = TONE_STYLES[tone]

  return (
    <span
      data-slot="status-badge"
      data-tone={tone}
      className={cn(
        'inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-md px-2 text-caption font-medium whitespace-nowrap',
        styles.badge,
        props.className,
      )}
    >
      {!props.hideDot && <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', styles.dot)} />}
      {label}
    </span>
  )
}
