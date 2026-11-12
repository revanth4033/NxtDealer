import { Link } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber, formatShare } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface RankedBarItem {
  key: string
  label: string
  count: number
  /** Makes the label a link, e.g. to a dealer's details page. */
  href?: string
}

interface RankedBarListProps {
  items: RankedBarItem[]
  /** The whole the shares are taken from, e.g. every published listing. */
  total: number
  /** Accessible name for the list, e.g. "Listings by city". */
  label: string
  /** Show each row's position (for rankings such as top dealers). */
  showRank?: boolean
  /** Router state sent with every row link. */
  linkState?: unknown
  className?: string
}

/**
 * Horizontal ranked bars drawn with CSS. Each row states its count and share in text; the bar,
 * scaled to the largest count in the list, only helps the eye compare rows and is hidden from
 * assistive technology.
 */
export function RankedBarList({ items, total, label, showRank = false, linkState, className }: RankedBarListProps) {
  const max = Math.max(1, ...items.map((item) => item.count))

  return (
    <ol aria-label={label} className={cn('flex flex-col gap-3', className)}>
      {items.map((item, index) => (
        <li key={item.key} className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-3">
            {showRank && (
              <span className="w-4 shrink-0 text-right text-caption text-muted-foreground tabular-nums">{index + 1}</span>
            )}
            <span className="min-w-0 flex-1 truncate text-sm">
              {item.href ? (
                <Link
                  to={item.href}
                  state={linkState}
                  className="rounded-sm font-medium text-foreground outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
            </span>
            <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
              {formatNumber(item.count)}
              <span className="sr-only"> {item.count === 1 ? 'listing' : 'listings'},</span>
            </span>
            <span className="w-9 shrink-0 text-right text-caption text-muted-foreground tabular-nums">
              {formatShare(item.count, total)}
              <span className="sr-only"> of all listings</span>
            </span>
          </div>
          <div aria-hidden className={cn('h-1.5 overflow-hidden rounded-full bg-muted', showRank && 'ml-7')}>
            <div className="h-full rounded-full bg-foreground-secondary/45" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function RankedBarListSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}
