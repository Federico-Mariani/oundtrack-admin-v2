import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideArrowUpDown,
  lucideSearchX,
  lucideLoaderCircle,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { type ColumnDef, FlexRender, injectTable, type RowData } from '@tanstack/angular-table';
import { dataTableFeatures, type DataTableFeatures } from './data-table-features';
import type { DataTableDensity } from './data-table-density';
import { DataTableToolbar } from './toolbar/data-table-toolbar';
import { DataTablePagination } from './pagination/data-table-pagination';
import { DataTableColumnResize } from './column-resize/data-table-column-resize';
import { dataTableTranslationsLoader } from './i18n/data-table-translations.loader';

/** Client-side table. Data fetching and business actions belong to the consuming feature. */
@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlexRender,
    HlmTableImports,
    HlmButton,
    TranslocoDirective,
    NgIcon,
    DataTableToolbar,
    DataTablePagination,
    DataTableColumnResize,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'data-table',
      alias: 'dataTable',
      loader: dataTableTranslationsLoader,
    }),
    provideIcons({
      lucideArrowDown,
      lucideArrowUp,
      lucideArrowUpDown,
      lucideSearchX,
      lucideLoaderCircle,
    }),
  ],
  templateUrl: './data-table.html',
})
export class DataTable<TData extends RowData> {
  readonly columns = input.required<ColumnDef<DataTableFeatures, TData>[]>();
  readonly data = input.required<readonly TData[]>();
  readonly getRowId = input.required<(row: TData) => string>();
  readonly caption = input.required<string>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly searchable = input(true);
  readonly retry = output();

  protected readonly density = signal<DataTableDensity>('comfortable');
  protected readonly table = injectTable(() => ({
    features: dataTableFeatures,
    columns: this.columns(),
    data: this.data(),
    getRowId: this.getRowId(),
    defaultColumn: { minSize: 100, size: 180, maxSize: 800 },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    globalFilterFn: 'includesString',
    columnResizeMode: 'onChange',
    enableMultiSort: false,
    autoResetPageIndex: true,
  }));
  protected readonly visibleColumnCount = computed(() =>
    Math.max(1, this.table.getVisibleLeafColumns().length),
  );
  protected readonly hasFilters = computed(
    () =>
      Boolean(this.table.atoms.globalFilter.get()) ||
      this.table.atoms.columnFilters.get().length > 0,
  );

  protected clearFilters(): void {
    this.table.resetGlobalFilter(true);
    this.table.resetColumnFilters(true);
    this.table.firstPage();
  }
}
