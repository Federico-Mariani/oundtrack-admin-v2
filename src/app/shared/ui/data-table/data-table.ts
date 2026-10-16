import type { DataTableRemoteState } from './data-table-remote-state';
import type { PageRequest } from '@shared/types/pagination/page-request';
import { fitTableColumns } from './sizing/fit-table-columns';
import { readTableColumnSizes } from './sizing/read-table-column-sizes';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  type ElementRef,
  input,
  output,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideArrowUpDown, lucideSearchX } from '@ng-icons/lucide';
import { Shimmer } from '../shimmer/shimmer';
import { Button } from '../button/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  type ColumnDef,
  type ColumnVisibilityState,
  FlexRender,
  injectTable,
  type PaginationState,
  type RowData,
  type Updater,
} from '@tanstack/angular-table';
import { dataTableFeatures, type DataTableFeatures } from './data-table-features';
import type { DataTableDensity } from './data-table-density';
import { DataTablePagination } from './pagination/data-table-pagination';
import { DataTableControls } from './controls/data-table-controls';
import { DataTableColumnResize } from './column-resize/data-table-column-resize';
import { dataTableTranslationsLoader } from './i18n/data-table-translations.loader';

/** Controlled server table. HTTP and business actions belong to the consuming feature. */
@Component({
  selector: 'app-data-table',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Shimmer,
    FlexRender,
    HlmTableImports,
    Button,
    TranslocoDirective,
    NgIcon,
    DataTableControls,
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
    }),
  ],
  templateUrl: './data-table.html',
})
export class DataTable<TData extends RowData> {
  readonly columns = input.required<Array<ColumnDef<DataTableFeatures, TData>>>();
  readonly data = input.required<ReadonlyArray<TData>>();
  readonly getRowId = input.required<(row: TData) => string>();
  readonly caption = input.required<string>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly controls = input<TemplateRef<unknown> | null>(null);
  readonly initialColumnVisibility = input<ColumnVisibilityState>({});
  readonly retry = output();
  readonly remote = input.required<DataTableRemoteState>();
  readonly pageChange = output<PageRequest>();
  readonly resetQuery = output();
  readonly showPagination = input(true);

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
    columnResizeMode: 'onChange',
    autoResetPageIndex: false,
    manualPagination: true,
    rowCount: this.remote().total,
    pageCount: Math.ceil(this.remote().total / this.remote().limit),
    state: { pagination: { pageIndex: this.remote().page - 1, pageSize: this.remote().limit } },
    onPaginationChange: (updater: Updater<PaginationState>): void => {
      const remote = this.remote();
      const current = { pageIndex: remote.page - 1, pageSize: remote.limit };
      const next = typeof updater === 'function' ? updater(current) : updater;
      const pages = Math.max(1, Math.ceil(remote.total / next.pageSize));
      if (
        this.loading() ||
        !Number.isInteger(next.pageIndex) ||
        next.pageIndex < 0 ||
        !Number.isInteger(next.pageSize) ||
        next.pageSize < 1 ||
        next.pageIndex >= pages
      ) {
        return;
      }
      if (next.pageIndex !== current.pageIndex || next.pageSize !== current.pageSize) {
        this.pageChange.emit({ page: next.pageIndex + 1, limit: next.pageSize });
      }
    },
  }));
  private readonly viewport = viewChild<ElementRef<HTMLDivElement>>('tableViewport');
  protected readonly viewportWidth = signal(0);
  constructor() {
    let previousViewportWidth = 0;
    let previousVisibleColumnIds: string | null = null;

    effect(() => {
      const columns = readTableColumnSizes(this.table);
      const width = this.viewportWidth();

      const visibleColumnIds = columns.map((column) => column.id).join('|');

      const resizedViewport = width > 0 && width !== previousViewportWidth;

      const visibilityChanged =
        previousVisibleColumnIds !== null && visibleColumnIds !== previousVisibleColumnIds;

      previousViewportWidth = width;
      previousVisibleColumnIds = visibleColumnIds;

      if (width <= 0 || columns.length === 0) {
        return;
      }

      const sizes = fitTableColumns(columns, width, resizedViewport || visibilityChanged);

      if (columns.some((column) => Math.abs(sizes[column.id] - column.size) > 0.01)) {
        this.table.setColumnSizing((current) => ({
          ...current,
          ...sizes,
        }));
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
  protected readonly loadingRows = computed(() =>
    Array.from({ length: Math.min(this.remote().limit, 10) }, (_, index) => index),
  );
  protected readonly hasFilters = computed(() => this.remote().filtered);
  protected clearFilters(): void {
    this.resetQuery.emit();
  }
}
