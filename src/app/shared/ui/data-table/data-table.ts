import type { DataTableRemoteState } from './data-table-remote-state';
import type { PageRequest } from '@shared/types/pagination/page-request';
import { fitTableColumns } from './sizing/fit-table-columns';
import { readTableColumnSizes } from './sizing/read-table-column-sizes';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  effect,
  viewChild,
  type ElementRef,
} from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideArrowUpDown,
  lucideSearchX,
  lucideLoaderCircle,
} from '@ng-icons/lucide';
import { Button } from '../button/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  type PaginationState,
  type Updater,
  type ColumnDef,
  type ColumnVisibilityState,
  FlexRender,
  injectTable,
  type RowData,
} from '@tanstack/angular-table';
import { dataTableFeatures, type DataTableFeatures } from './data-table-features';
import type { DataTableDensity } from './data-table-density';
import { DataTableToolbar } from './toolbar/data-table-toolbar';
import { DataTablePagination } from './pagination/data-table-pagination';
import { DataTableColumnResize } from './column-resize/data-table-column-resize';
import { dataTableTranslationsLoader } from './i18n/data-table-translations.loader';

/** Client or controlled server table. HTTP and business actions belong to the consuming feature. */
@Component({
  selector: 'app-data-table',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlexRender,
    HlmTableImports,
    Button,
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
  readonly initialColumnVisibility = input<ColumnVisibilityState>({});
  readonly retry = output();
  readonly remote = input<DataTableRemoteState | null>(null);
  readonly pageChange = output<PageRequest>();
  readonly searchChange = output<string>();
  readonly resetQuery = output();

  protected readonly density = signal<DataTableDensity>('comfortable');
  protected readonly table = injectTable(() => ({
    features: dataTableFeatures,
    columns: this.columns(),
    data: this.data(),
    getRowId: this.getRowId(),
    defaultColumn: { minSize: 100, size: 180, maxSize: 800 },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnVisibility: this.initialColumnVisibility(),
    },
    globalFilterFn: 'includesString',
    columnResizeMode: 'onChange',
    enableMultiSort: false,
    autoResetPageIndex: !this.remote(),
    manualPagination: Boolean(this.remote()),
    manualFiltering: Boolean(this.remote()),
    manualSorting: Boolean(this.remote()),
    enableSorting: !this.remote(),
    ...(this.remote()
      ? {
          rowCount: this.remote()?.total ?? 0,
          state: {
            pagination: {
              pageIndex: (this.remote()?.page ?? 1) - 1,
              pageSize: this.remote()?.limit ?? 20,
            },
          },
          onPaginationChange: (updater: Updater<PaginationState>): void => {
            const remote = this.remote();
            if (!remote) {
              return;
            }
            const current = { pageIndex: remote.page - 1, pageSize: remote.limit };
            const next = typeof updater === 'function' ? updater(current) : updater;
            if (next.pageIndex !== current.pageIndex || next.pageSize !== current.pageSize) {
              this.pageChange.emit({ page: next.pageIndex + 1, limit: next.pageSize });
            }
          },
        }
      : {}),
  }));
  private readonly viewport = viewChild<ElementRef<HTMLDivElement>>('tableViewport');
  protected readonly viewportWidth = signal(0);
  constructor() {
    let previousViewportWidth = 0;
    effect(() => {
      const columns = readTableColumnSizes(this.table);
      const width = this.viewportWidth();
      const resizedViewport = width > 0 && width !== previousViewportWidth;
      previousViewportWidth = width;
      const sizes = fitTableColumns(columns, width, resizedViewport);
      if (columns.some((column) => Math.abs(sizes[column.id] - column.size) > 0.01)) {
        this.table.setColumnSizing((current) => ({ ...current, ...sizes }));
      }
    });

    effect((onCleanup) => {
      const element = this.viewport()?.nativeElement;
      if (!element || typeof ResizeObserver === 'undefined') {
        return;
      }
      const measure = (): void => {
        this.viewportWidth.set(Math.floor(element.clientWidth));
      };
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      measure();
      onCleanup(() => {
        observer.disconnect();
      });
    });
  }

  protected readonly visibleColumnCount = computed(() =>
    Math.max(1, this.table.getVisibleLeafColumns().length),
  );
  protected readonly hasFilters = computed(
    () =>
      (this.remote()?.filtered ?? Boolean(this.table.atoms.globalFilter.get())) ||
      this.table.atoms.columnFilters.get().length > 0,
  );

  protected clearFilters(): void {
    if (this.remote()) {
      this.resetQuery.emit();
      return;
    }
    this.table.resetGlobalFilter(true);
    this.table.resetColumnFilters(true);
    this.table.firstPage();
  }
}
