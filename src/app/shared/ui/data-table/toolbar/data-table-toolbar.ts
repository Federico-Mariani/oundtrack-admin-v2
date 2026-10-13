import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideSettings2, lucideRotateCcw, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import type { Column, RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';
import type { DataTableDensity } from '../data-table-density';

@Component({
  selector: 'app-data-table-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, HlmButton, HlmInput, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideSearch, lucideSettings2, lucideRotateCcw, lucideX })],
  templateUrl: './data-table-toolbar.html',
})
export class DataTableToolbar<TData extends RowData> {
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  readonly searchable = input(true);
  readonly density = model<DataTableDensity>('comfortable');
  protected readonly search = computed(() => {
    const value: unknown = this.table().atoms.globalFilter.get();
    return typeof value === 'string' ? value : '';
  });

  protected setSearch(value: string): void {
    this.table().setGlobalFilter(value);
    this.table().firstPage();
  }

  protected columnLabel(column: Column<DataTableFeatures, TData>): string {
    const header = column.columnDef.header;
    return typeof header === 'string' ? header : column.id;
  }

  protected resetView(): void {
    this.setSearch('');
    this.table().resetColumnFilters(true);
    this.table().resetSorting();
    this.table().resetColumnVisibility();
    this.table().resetColumnSizing();
    this.table().resetPagination();
    this.density.set('comfortable');
  }
}
