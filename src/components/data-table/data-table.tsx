import { useTable, type RowData, type SortingState } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import type { MouseEvent, ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { dataTableFeatures, type DataTableColumn } from './data-table-config'

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  getRowId: (row: TData) => string
  /** Accessible name for the table, e.g. "Dealers". */
  label: string
  /** First load: renders skeleton rows. */
  isLoading?: boolean
  /** Background refetch (e.g. new page): dims current rows instead of replacing them. */
  isRefreshing?: boolean
  /** Controlled sort state. Omit `onSortingChange` to disable sorting. */
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  /** Rendered in place of rows when `data` is empty and not loading. */
  emptyState?: ReactNode
  /** Number of skeleton rows while loading. */
  skeletonRows?: number
  /** Slot above the table, typically filters and search. */
  toolbar?: ReactNode
  /** Slot below the table, typically Pagination. */
  footer?: ReactNode
  /**
   * Makes whole rows clickable, e.g. to open a details page. Mouse convenience only: also render a
   * link or button inside the row for keyboard and screen-reader users. Clicks on interactive
   * elements inside the row, and clicks that end a text selection, are ignored.
   */
  onRowClick?: (row: TData) => void
  className?: string
}

const NO_SORTING: SortingState = []

const ALIGN_CLASS = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

function handleRowClick(event: MouseEvent<HTMLTableRowElement>, open: () => void) {
  if ((event.target as HTMLElement).closest('a, button, input, [role="menuitem"]')) return
  if (window.getSelection()?.toString()) return
  open()
}

/**
 * Data table surface: toolbar, sortable headers, loading skeleton, empty state and footer.
 * Data processing (sort, filter, paginate) is owned by the caller/service, not the table.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  label,
  isLoading = false,
  isRefreshing = false,
  sorting = NO_SORTING,
  onSortingChange,
  emptyState,
  skeletonRows = 8,
  toolbar,
  footer,
  onRowClick,
  className,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    state: { sorting },
    onSortingChange: (updater) => onSortingChange?.(typeof updater === 'function' ? updater(sorting) : updater),
    manualSorting: true,
    enableSorting: Boolean(onSortingChange),
    enableMultiSort: false,
  })

  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length
  const showEmpty = !isLoading && rows.length === 0

  return (
    <div data-slot="data-table" className={cn('surface overflow-hidden', className)}>
      {toolbar && <div className="border-b px-5 py-3.5">{toolbar}</div>}

      <Table aria-label={label} aria-busy={isLoading || isRefreshing}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                const align = meta?.align ?? 'left'

                return (
                  <TableHead
                    key={header.id}
                    aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : canSort ? 'none' : undefined}
                    className={cn(ALIGN_CLASS[align], meta?.className)}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          '-mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
                          sorted && 'text-foreground',
                          align === 'right' && 'flex-row-reverse',
                        )}
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' ? (
                          <ArrowUp aria-hidden className="size-3.5" />
                        ) : sorted === 'desc' ? (
                          <ArrowDown aria-hidden className="size-3.5" />
                        ) : (
                          <ChevronsUpDown aria-hidden className="size-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className={cn('transition-opacity duration-150', isRefreshing && !isLoading && 'opacity-60')}>
          {isLoading
            ? Array.from({ length: skeletonRows }, (_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                  {table.getAllLeafColumns().map((column, columnIndex) => (
                    <TableCell key={column.id} className={column.columnDef.meta?.className}>
                      <Skeleton
                        className={cn(
                          'h-4',
                          columnIndex === 0 ? 'w-40' : 'w-20',
                          column.columnDef.meta?.align === 'right' && 'ml-auto',
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? (event) => handleRowClick(event, () => onRowClick(row.original)) : undefined}
                  className={cn(onRowClick && 'group/row cursor-pointer')}
                >
                  {row.getAllCells().map((cell) => {
                    const meta = cell.column.columnDef.meta
                    return (
                      <TableCell key={cell.id} className={cn(ALIGN_CLASS[meta?.align ?? 'left'], meta?.className)}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}

          {showEmpty && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnCount} className="h-auto p-0 whitespace-normal">
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {footer && <div className="border-t px-5 py-3">{footer}</div>}
    </div>
  )
}
