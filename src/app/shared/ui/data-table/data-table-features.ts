import {
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table';
/** Only presentation and controlled pagination: no client filtering or sorting engines. */
export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowPaginationFeature,
});
export type DataTableFeatures = typeof dataTableFeatures;
