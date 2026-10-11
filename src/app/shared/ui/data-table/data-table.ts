import { Component, input } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { type ColumnDef, FlexRender, injectTable, type RowData } from '@tanstack/angular-table';

import { dataTableFeatures, type DataTableFeatures } from './data-table-features';

@Component({
  selector: 'app-data-table',
  imports: [FlexRender, HlmTableImports],
  template: `
    <div class="overflow-hidden rounded-md border">
      <div hlmTableContainer>
        <table hlmTable>
          <thead hlmTHead>
            @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
              <tr hlmTr>
                @for (header of headerGroup.headers; track header.id) {
                  <th hlmTh [attr.colSpan]="header.colSpan">
                    @if (!header.isPlaceholder) {
                      <ng-container
                        *flexRender="
                          header.column.columnDef.header;
                          props: header.getContext();
                          let headerText
                        "
                      >
                        <div [innerHTML]="headerText"></div>
                      </ng-container>
                    }
                  </th>
                }
              </tr>
            }
          </thead>

          <tbody hlmTBody>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr hlmTr>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td hlmTd>
                    <ng-container
                      *flexRender="
                        cell.column.columnDef.cell;
                        props: cell.getContext();
                        let cellText
                      "
                    >
                      <div [innerHTML]="cellText"></div>
                    </ng-container>
                  </td>
                }
              </tr>
            } @empty {
              <tr hlmTr>
                <td hlmTd class="h-24 text-center" [attr.colspan]="columns().length">
                  No results.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
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
