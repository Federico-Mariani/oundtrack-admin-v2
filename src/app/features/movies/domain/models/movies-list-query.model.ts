import type { ListQuery } from '@shared/types/pagination/list-query';
import type { MovieListFilters } from './movie-list-filters.model';
export type MoviesListQuery = ListQuery<
  MovieListFilters,
  'createdAt' | 'updatedAt' | 'externalMovieId'
>;
export const DEFAULT_MOVIES_LIST_QUERY: MoviesListQuery = {
  page: 1,
  limit: 20,
  search: '',
  filters: {},
  sortBy: 'createdAt',
  sortOrder: 'desc',
};
