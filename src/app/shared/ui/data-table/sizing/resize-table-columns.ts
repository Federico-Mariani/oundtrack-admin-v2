import type { DataTableColumnSize } from './data-table-column-size';

/** Move an internal boundary without shifting subsequent boundaries or fixed action columns. */
export function resizeTableColumns(
  columns: readonly DataTableColumnSize[],
  id: string,
  delta: number,
  viewportWidth: number,
): Record<string, number> {
  const sizes = Object.fromEntries(columns.map((column) => [column.id, column.size]));
  const index = columns.findIndex((column) => column.id === id);
  const column = columns.find((item) => item.id === id);
  if (!column?.resizable) {
    return sizes;
  }
  const neighbor = columns.at(index + 1);
  const total = columns.reduce((sum, item) => sum + item.size, 0);
  let lower = column.min - column.size;
  let upper = column.max - column.size;
  if (neighbor?.resizable) {
    lower = Math.max(lower, neighbor.size - neighbor.max);
    upper = Math.min(upper, neighbor.size - neighbor.min);
  } else {
    // At the final resizable boundary, growth creates horizontal overflow; shrinking
    // stops at the viewport so actions can never drift into the middle of the box.
    lower = Math.max(lower, Math.min(0, viewportWidth - total));
  }
  const applied = Math.min(upper, Math.max(lower, delta));
  sizes[id] = column.size + applied;
  if (neighbor?.resizable) {
    sizes[neighbor.id] = neighbor.size - applied;
  }
  return sizes;
}
