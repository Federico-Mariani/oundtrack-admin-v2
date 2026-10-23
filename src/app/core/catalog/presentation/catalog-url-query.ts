import type { ParamMap, Params } from '@angular/router';
export const CatalogQueryKey = {
  Page: 'page',
  Limit: 'limit',
  Search: 'search',
  YearFrom: 'releaseYearFrom',
  YearTo: 'releaseYearTo',
  SortBy: 'sortBy',
  SortOrder: 'sortOrder',
  Detail: 'detail',
} as const;
export const CatalogSort = { CreatedAt: 'createdAt', UpdatedAt: 'updatedAt' } as const;
export const CatalogSortOrder = { Ascending: 'asc', Descending: 'desc' } as const;
export interface CatalogUrlQuery<TExternal extends string> {
  readonly page: number;
  readonly limit: number;
  readonly search: string;
  readonly filters: {
    readonly releaseYearFrom?: number;
    readonly releaseYearTo?: number;
  } & Partial<Record<TExternal, number>>;
  readonly sortBy: (typeof CatalogSort)[keyof typeof CatalogSort] | TExternal;
  readonly sortOrder: (typeof CatalogSortOrder)[keyof typeof CatalogSortOrder];
}
function positiveInteger(
  value: string | null,
  maximum = Number.MAX_SAFE_INTEGER,
): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 && number <= maximum ? number : undefined;
}
export function readCatalogQuery<TExternal extends string>(
  params: ParamMap,
  externalKey: TExternal,
): CatalogUrlQuery<TExternal> {
  const sort = params.get(CatalogQueryKey.SortBy);
  const yearFrom = positiveInteger(params.get(CatalogQueryKey.YearFrom), 9999);
  const yearTo = positiveInteger(params.get(CatalogQueryKey.YearTo), 9999);
  return {
    page: positiveInteger(params.get(CatalogQueryKey.Page)) ?? 1,
    limit: positiveInteger(params.get(CatalogQueryKey.Limit), 100) ?? 20,
    search: params.get(CatalogQueryKey.Search) ?? '',
    filters: {
      [externalKey]: positiveInteger(params.get(externalKey)),
      releaseYearFrom: yearFrom,
      releaseYearTo: yearFrom && yearTo && yearFrom > yearTo ? undefined : yearTo,
    } as CatalogUrlQuery<TExternal>['filters'],
    sortBy:
      sort === externalKey
        ? externalKey
        : sort === CatalogSort.UpdatedAt
          ? CatalogSort.UpdatedAt
          : CatalogSort.CreatedAt,
    sortOrder:
      params.get(CatalogQueryKey.SortOrder) === CatalogSortOrder.Ascending
        ? CatalogSortOrder.Ascending
        : CatalogSortOrder.Descending,
  };
}
export function writeCatalogQuery<TExternal extends string>(
  query: CatalogUrlQuery<TExternal>,
  externalKey: TExternal,
): Params {
  return {
    [CatalogQueryKey.Page]: query.page === 1 ? null : query.page,
    [CatalogQueryKey.Limit]: query.limit === 20 ? null : query.limit,
    [CatalogQueryKey.Search]: query.search || null,
    [CatalogQueryKey.YearFrom]: query.filters.releaseYearFrom ?? null,
    [CatalogQueryKey.YearTo]: query.filters.releaseYearTo ?? null,
    [externalKey]: query.filters[externalKey] ?? null,
    [CatalogQueryKey.SortBy]: query.sortBy === CatalogSort.CreatedAt ? null : query.sortBy,
    [CatalogQueryKey.SortOrder]:
      query.sortOrder === CatalogSortOrder.Descending ? null : query.sortOrder,
  };
}
export function readCatalogDetailId(params: ParamMap): string | null {
  const id = params.get(CatalogQueryKey.Detail)?.trim();
  return id && /^[a-zA-Z0-9_-]{1,128}$/.test(id) ? id : null;
}
