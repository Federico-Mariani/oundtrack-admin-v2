import { HttpParams } from '@angular/common/http';
import type { ListQuery } from '@shared/types/pagination/list-query';
export function listHttpParams<TFilters, TSort extends string>(
  query: ListQuery<TFilters, TSort>,
  filters: Readonly<Record<string, string | number | undefined>>,
): HttpParams {
  let params = new HttpParams()
    .set('page', query.page)
    .set('limit', query.limit)
    .set('sortBy', query.sortBy)
    .set('sortOrder', query.sortOrder);
  const search = query.search.trim();
  if (search) {
    params = params.set('search', search);
  }
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      params = params.set(key, value);
    }
  }
  return params;
}
