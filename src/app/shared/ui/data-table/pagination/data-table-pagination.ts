import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { IconButton } from '../../icon-button/icon-button';
import { Select } from '../../select/select';
import type { RowData, Table } from '@tanstack/angular-table';
import type { DataTableRemoteState } from '../data-table-remote-state';
import type { DataTableFeatures } from '../data-table-features';

@Component({
  selector: 'app-data-table-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, IconButton, Select],
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
  readonly disabled = input(false);
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  readonly remote = input.required<DataTableRemoteState>();
  protected readonly pagination = computed(() => ({
    pageIndex: this.remote().page - 1,
    pageSize: this.remote().limit,
  }));
  protected readonly pageCount = computed(() =>
    Math.ceil(this.remote().total / this.remote().limit),
  );
  protected readonly canPrevious = computed(() => !this.disabled() && this.remote().page > 1);
  protected readonly canNext = computed(
    () => !this.disabled() && this.remote().page < this.pageCount(),
  );
  protected readonly total = computed(() => this.remote().total);
  protected readonly start = computed(() =>
    this.total() === 0 ? 0 : this.pagination().pageIndex * this.pagination().pageSize + 1,
  );
  protected readonly end = computed(() =>
    Math.min(this.total(), (this.pagination().pageIndex + 1) * this.pagination().pageSize),
  );
  protected readonly page = computed(() =>
    this.total() === 0 ? 0 : this.pagination().pageIndex + 1,
  );
  protected readonly pageSizes = [10, 20, 25, 50, 100];
  protected readonly pageSizeItems = this.pageSizes.map((size) => ({
    label: String(size),
    value: String(size),
  }));
  protected readonly pageSizeValue = computed(() => String(this.pagination().pageSize));

  protected setPageSize(value: string): void {
    const size = Number(value);
    if (!this.disabled() && this.pageSizes.includes(size)) {
      this.table().setPagination({ pageIndex: 0, pageSize: size });
    }
  }
}
