import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import type { Header, RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';
import type { DataTableColumnSize } from '../sizing/data-table-column-size';
import { readTableColumnSizes } from '../sizing/read-table-column-sizes';
import { resizeTableColumns } from '../sizing/resize-table-columns';

@Component({
  selector: 'app-data-table-column-resize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  templateUrl: './data-table-column-resize.html',
})
export class DataTableColumnResize<TData extends RowData> {
  readonly header = input.required<Header<DataTableFeatures, TData>>();
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  readonly viewportWidth = input(0);
  protected readonly resizing = signal(false);
  private startX = 0;
  private pointerId: number | null = null;
  private startColumns: ReadonlyArray<DataTableColumnSize> = [];

  protected startResize(event: PointerEvent): void {
    if (event.button !== 0 || !event.isPrimary || !(event.currentTarget instanceof HTMLElement)) {
      return;
    }
    event.preventDefault();
    this.startX = event.clientX;
    this.startColumns = readTableColumnSizes(this.table());
    this.pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.resizing.set(true);
  }

  protected moveResize(event: PointerEvent): void {
    if (this.pointerId === event.pointerId) {
      this.apply(this.startColumns, event.clientX - this.startX);
    }
  }

  protected endResize(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) {
      return;
    }
    this.pointerId = null;
    this.startColumns = [];
    this.resizing.set(false);
    if (
      event.currentTarget instanceof HTMLElement &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  protected resetSize(): void {
    const column = this.header().column;
    this.apply(
      readTableColumnSizes(this.table()),
      (column.columnDef.size ?? 180) - column.getSize(),
    );
  }

  protected resizeWithKeyboard(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.resetSize();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const step = event.shiftKey ? 40 : 10;
      this.apply(readTableColumnSizes(this.table()), event.key === 'ArrowRight' ? step : -step);
    }
  }

  private apply(columns: ReadonlyArray<DataTableColumnSize>, delta: number): void {
    const sizes = resizeTableColumns(columns, this.header().column.id, delta, this.viewportWidth());
    this.table().setColumnSizing((current) => ({ ...current, ...sizes }));
  }
}
