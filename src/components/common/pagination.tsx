import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useId } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

interface PaginationProps {
  /** 1-based current page. */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  /** Plural noun for the summary, e.g. "dealers" → "Showing 1–10 of 26 dealers". */
  itemLabel?: string
  className?: string
}

const ELLIPSIS = 'ellipsis' as const

/** Page numbers to show: always first/last, current ±1, ellipses for gaps. */
function getPageItems(page: number, pageCount: number): (number | typeof ELLIPSIS)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount))
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (page >= pageCount - 2) [pageCount - 3, pageCount - 2, pageCount - 1].forEach((p) => pages.add(p))

  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? [ELLIPSIS, p] : [p]))
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemLabel = 'results',
  className,
}: PaginationProps) {
  const id = useId()
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-x-6 gap-y-3', className)}>
      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        {total === 0 ? (
          `No ${itemLabel}`
        ) : (
          <>
            Showing <span className="font-medium text-foreground">{formatNumber(from)}–{formatNumber(to)}</span> of{' '}
            <span className="font-medium text-foreground">{formatNumber(total)}</span> {itemLabel}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span id={`${id}-label`}>Rows per page</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-labelledby={`${id}-label ${id}-value`} className="gap-1 tabular-nums">
                  <span id={`${id}-value`}>{pageSize}</span>
                  <ChevronDown aria-hidden className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24 min-w-24">
                <DropdownMenuRadioGroup value={String(pageSize)} onValueChange={(next) => onPageSizeChange(Number(next))}>
                  {pageSizeOptions.map((option) => (
                    <DropdownMenuRadioItem key={option} value={String(option)} className="tabular-nums">
                      {option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>

          {getPageItems(page, pageCount).map((item, index) =>
            item === ELLIPSIS ? (
              <span key={`ellipsis-${index}`} aria-hidden className="grid size-8 place-items-center text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={item}
                variant="ghost"
                size="icon-sm"
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  'text-sm tabular-nums text-foreground-secondary',
                  item === page && 'bg-accent font-semibold text-accent-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {item}
              </Button>
            ),
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </nav>
      </div>
    </div>
  )
}
