import type { DataTableColumnSize } from './data-table-column-size';

/** Fill spare space; optionally refit a changed viewport while preserving readable minimums. */
export function fitTableColumns(
  columns: ReadonlyArray<DataTableColumnSize>,
  width: number,
  shrinkToFit = false,
): Record<string, number> {
  const sizes = Object.fromEntries(columns.map((column) => [column.id, column.size]));
  let remaining = width - columns.reduce((sum, column) => sum + column.size, 0);
  let candidates = columns.filter((column) => column.resizable && column.size < column.max);
  while (remaining > 0.01 && candidates.length > 0) {
    const weight = candidates.reduce((sum, column) => sum + column.size, 0);
    let allocated = 0;
    for (const column of candidates) {
      const extra = Math.min(column.max - sizes[column.id], (remaining * column.size) / weight);
      sizes[column.id] += extra;
      allocated += extra;
    }
    remaining -= allocated;
    candidates = candidates.filter((column) => sizes[column.id] < column.max);
  }
  if (shrinkToFit && remaining < 0) {
    let deficit = -remaining;
    let shrinkable = columns.filter((column) => column.resizable && sizes[column.id] > column.min);
    while (deficit > 0.01 && shrinkable.length > 0) {
      const capacity = shrinkable.reduce((sum, column) => sum + sizes[column.id] - column.min, 0);
      let removed = 0;
      for (const column of shrinkable) {
        const available = sizes[column.id] - column.min;
        const reduction = Math.min(available, (deficit * available) / capacity);
        sizes[column.id] -= reduction;
        removed += reduction;
      }
      deficit -= removed;
      shrinkable = shrinkable.filter((column) => sizes[column.id] > column.min);
    }
  }
  return sizes;
}
