import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideSettings2,
  lucideRotateCcw,
  lucideX,
  lucideArrowUpDown,
} from '@ng-icons/lucide';
import { Button } from '../../button/button';
import { IconButton } from '../../icon-button/icon-button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import type { Column, RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';
import type { DataTableDensity } from '../data-table-density';

@Component({
  selector: 'app-data-table-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, Button, IconButton, HlmInput, HlmDropdownMenuImports],
  providers: [
    provideIcons({ lucideSearch, lucideSettings2, lucideRotateCcw, lucideX, lucideArrowUpDown }),
  ],
  templateUrl: './data-table-toolbar.html',
})
export class DataTableToolbar<TData extends RowData> {
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  readonly remoteSearch = input<string | null>(null);
  readonly searchChange = output<string>();
  readonly resetQuery = output();
  protected readonly canSort = computed(() =>
    this.table()
      .getAllLeafColumns()
      .some((column) => column.getCanSort()),
  );
  readonly searchable = input(true);
  readonly density = model<DataTableDensity>('comfortable');
  protected readonly search = computed(() => {
    if (this.remoteSearch() !== null) {
      return this.remoteSearch() ?? '';
    }
    const value: unknown = this.table().atoms.globalFilter.get();
    return typeof value === 'string' ? value : '';
  });

  protected setSearch(value: string): void {
    if (this.remoteSearch() !== null) {
      this.searchChange.emit(value);
      return;
    }
    this.table().setGlobalFilter(value);
    this.table().firstPage();
  }

  protected columnLabel(column: Column<DataTableFeatures, TData>): string {
    const header = column.columnDef.header;
    return typeof header === 'string' ? header : column.id;
  }

  protected resetView(): void {
    if (this.remoteSearch() !== null) {
      this.resetQuery.emit();
    } else {
      this.setSearch('');
      this.table().resetColumnFilters(true);
      this.table().resetSorting();
      this.table().resetPagination();
    }
    this.table().resetColumnVisibility();
    this.table().resetColumnSizing();
    this.density.set('comfortable');
  }
}
