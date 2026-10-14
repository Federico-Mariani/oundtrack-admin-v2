import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
  type TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideListOrdered } from '@ng-icons/lucide';
import type { RowData, Table } from '@tanstack/angular-table';
import type { DataTableFeatures } from '../data-table-features';
import type { DataTableDensity } from '../data-table-density';
import { DataTableToolbar } from '../toolbar/data-table-toolbar';
import { DataTablePagination } from '../pagination/data-table-pagination';
import { Dialog } from '../../dialog/dialog';
import { IconButton } from '../../icon-button/icon-button';
@Component({
  selector: 'app-data-table-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    TranslocoDirective,
    DataTableToolbar,
    DataTablePagination,
    Dialog,
    IconButton,
  ],
  providers: [provideIcons({ lucideListOrdered })],
  templateUrl: './data-table-controls.html',
  host: { class: '@container/table-controls block min-w-0' },
})
export class DataTableControls<TData extends RowData> {
  readonly table = input.required<Table<DataTableFeatures, TData>>();
  readonly controls = input<TemplateRef<unknown> | null>(null);
  readonly loading = input(false);
  readonly refresh = output();
  readonly density = model<DataTableDensity>('comfortable');
  protected readonly paginationOpen = signal(false);
}
