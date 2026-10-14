import type { PageRequest } from './page-request';
export interface ListQuery<TFilters, TSort extends string> extends PageRequest {
  readonly search: string;
  readonly filters: TFilters;
  readonly sortBy: TSort;
  readonly sortOrder: 'asc' | 'desc';
}
