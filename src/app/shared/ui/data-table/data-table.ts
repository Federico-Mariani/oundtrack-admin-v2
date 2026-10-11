import { Component, input } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { type ColumnDef, FlexRender, injectTable, type RowData } from '@tanstack/angular-table';

import { dataTableFeatures, type DataTableFeatures } from './data-table-features';

@Component({
  selector: 'app-data-table',
  imports: [FlexRender, HlmTableImports],
  templateUrl: './data-table.html',
})
export class DataTable<TData extends RowData> {
  readonly columns = input.required<ColumnDef<DataTableFeatures, TData>[]>();

  readonly data = input.required<TData[]>();

  protected readonly table = injectTable(() => ({
    features: dataTableFeatures,
    columns: this.columns(),
    data: this.data(),
  }));
}
