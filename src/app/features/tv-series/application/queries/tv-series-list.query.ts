import type { ListQuery } from '@shared/types/pagination/list-query';
import type { TvSeriesListFilters } from './tv-series-list.filters';

export type TvSeriesListQuery = ListQuery<
  TvSeriesListFilters,
  'createdAt' | 'updatedAt' | 'externalTvSeriesId'
>;

export const DEFAULT_TV_SERIES_LIST_QUERY: TvSeriesListQuery = {
  page: 1,
  limit: 20,
  search: '',
  filters: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
};
