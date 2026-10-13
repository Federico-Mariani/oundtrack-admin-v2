import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import type { Header, RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';

@Component({
  selector: 'app-data-table-column-resize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  templateUrl: './data-table-column-resize.html',
})
export class DataTableColumnResize<TData extends RowData> {
  readonly header = input.required<Header<DataTableFeatures, TData>>();
  readonly table = input.required<Table<DataTableFeatures, TData>>();

  protected resizeWithKeyboard(event: KeyboardEvent): void {
    const column = this.header().column;
    if (event.key === 'Enter') {
      event.preventDefault();
      column.resetSize();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const step = event.shiftKey ? 40 : 10;
      const size = Math.min(
        column.columnDef.maxSize ?? 800,
        Math.max(
          column.columnDef.minSize ?? 100,
          column.getSize() + (event.key === 'ArrowRight' ? step : -step),
        ),
      );
      this.table().setColumnSizing((current) => ({ ...current, [column.id]: size }));
    }
  }
}
