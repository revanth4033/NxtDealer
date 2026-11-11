import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

import { formatPercentChange } from '@/lib/format'
import { cn } from '@/lib/utils'

interface TrendIndicatorProps {
  /** Fractional change, e.g. 0.124 = +12.4% */
  changeRatio: number
  /** Whether an increase is good news. Drives colour, not arrow direction. */
  betterWhen?: 'higher' | 'lower'
  className?: string
}

/** Percentage change with direction arrow. Colour reflects sentiment; the arrow and sign carry meaning without colour. */
export function TrendIndicator({ changeRatio, betterWhen = 'higher', className }: TrendIndicatorProps) {
  const direction = changeRatio > 0 ? 'up' : changeRatio < 0 ? 'down' : 'flat'
  const isGood = direction === 'flat' ? null : (direction === 'up') === (betterWhen === 'higher')
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-caption font-semibold tabular-nums',
        isGood === null ? 'text-muted-foreground' : isGood ? 'text-success' : 'text-destructive',
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2.25} />
      {formatPercentChange(changeRatio)}
    </span>
  )
}
