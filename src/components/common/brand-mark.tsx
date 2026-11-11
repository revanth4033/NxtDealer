import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
  /** Hide the wordmark and show only the logo glyph. */
  compact?: boolean
}

/**
 * NxtDealer brand lockup.
 * The glyph is a placeholder — swap for the official logo asset when available.
 */
export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-[15px] font-bold tracking-tight text-primary-foreground shadow-card"
      >
        N
      </span>
      {compact ? (
        <span className="sr-only">NxtDealer Admin</span>
      ) : (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">NxtDealer</span>
          <span className="mt-1 text-caption text-muted-foreground">Admin portal</span>
        </span>
      )}
    </div>
  )
}
