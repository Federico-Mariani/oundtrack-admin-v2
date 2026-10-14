import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideSettings2 } from '@ng-icons/lucide';
import { IconButton } from '../../icon-button/icon-button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import type { Column, RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';
import type { DataTableDensity } from '../data-table-density';
@Component({
  selector: 'app-data-table-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, IconButton, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideSettings2 })],
  templateUrl: './data-table-toolbar.html',
})
export class DataTableToolbar<TData extends RowData> {
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  readonly loading = input(false);
  readonly refresh = output();
  readonly density = model<DataTableDensity>('comfortable');
  protected columnLabel(column: Column<DataTableFeatures, TData>): string {
    const header = column.columnDef.header;
    return typeof header === 'string' ? header : column.id;
  }
  protected resetView(): void {
    this.table().resetColumnVisibility();
    this.table().resetColumnSizing();
    this.density.set('comfortable');
  }
}
