import type { RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';
import type { DataTableColumnSize } from './data-table-column-size';

export function readTableColumnSizes<TData extends RowData>(
  table: Table<DataTableFeatures, TData>,
): DataTableColumnSize[] {
  return table.getVisibleLeafColumns().map((column) => ({
    id: column.id,
    size: column.getSize(),
    min: column.columnDef.minSize ?? 100,
    max: column.columnDef.maxSize ?? 800,
    resizable: column.getCanResize(),
  }));
}
