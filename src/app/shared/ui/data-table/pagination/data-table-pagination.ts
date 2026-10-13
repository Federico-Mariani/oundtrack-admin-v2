import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import type { RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';

@Component({
  selector: 'app-data-table-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, HlmButton],
  providers: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  templateUrl: './data-table-pagination.html',
})
export class DataTablePagination<TData extends RowData> {
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  protected readonly pagination = computed(() => this.table().atoms.pagination.get());
  protected readonly total = computed(() => this.table().getRowCount());
  protected readonly start = computed(() =>
    this.total() === 0 ? 0 : this.pagination().pageIndex * this.pagination().pageSize + 1,
  );
  protected readonly end = computed(() =>
    Math.min(this.total(), (this.pagination().pageIndex + 1) * this.pagination().pageSize),
  );
  protected readonly page = computed(() =>
    this.total() === 0 ? 0 : this.pagination().pageIndex + 1,
  );
  protected readonly pageSizes = [10, 25, 50, 100];

  protected setPageSize(value: string): void {
    const size = Number(value);
    if (this.pageSizes.includes(size)) {
      this.table().setPageSize(size);
      this.table().firstPage();
    }
  }
}
