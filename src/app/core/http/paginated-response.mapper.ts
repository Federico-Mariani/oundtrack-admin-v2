import type { PageResult } from '@shared/types/pagination/page-result';
import type { PaginatedApiResponse } from './paginated-api-response';
export function mapPaginatedResponse<TDto, T>(
  response: PaginatedApiResponse<TDto>,
  mapItem: (item: TDto) => T,
): PageResult<T> {
  return {
    items: response.data.map(mapItem),
    page: response.meta.page,
    limit: response.meta.limit,
    total: response.meta.total,
  };
}
