import type { CellData, RowData, TableFeatures } from '@tanstack/table-core'
import { createColumnHelper, rowSortingFeature, tableFeatures, type ColumnDef } from '@tanstack/react-table'

/**
 * Features registered for every DataTable. Sorting is "manual": the service sorts,
 * the table only tracks and displays sort state.
 */
export const dataTableFeatures = tableFeatures({ rowSortingFeature })
export type DataTableFeatures = typeof dataTableFeatures

// oxlint-disable-next-line typescript/no-explicit-any -- columns hold heterogeneous value types
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

/** Typed column helper bound to the DataTable feature set: `const col = createDataTableColumnHelper<Dealer>()`. */
export const createDataTableColumnHelper = <TData extends RowData>() => createColumnHelper<DataTableFeatures, TData>()

declare module '@tanstack/table-core' {
  interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {
    /** Horizontal alignment for header and cells. Use "right" for numeric columns. */
    align?: 'left' | 'right' | 'center'
    /** Extra classes for every cell in this column (e.g. width constraints). */
    className?: string
  }
}
