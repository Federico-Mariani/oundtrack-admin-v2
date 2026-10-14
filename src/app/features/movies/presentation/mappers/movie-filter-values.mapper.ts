import type { MoviesListQuery } from '../../domain/models/movies-list-query.model';
import type { MoviesFilterFormModel } from '../models/movies-filter-form.model';
export function toMovieFilterValues(query: MoviesListQuery): MoviesFilterFormModel {
  return {
    search: query.search,
    releaseYearFrom: String(query.filters.releaseYearFrom ?? ''),
    releaseYearTo: String(query.filters.releaseYearTo ?? ''),
    externalMovieId: String(query.filters.externalMovieId ?? ''),
    sort: `${query.sortBy}:${query.sortOrder}`,
  };
}
export function applyMovieFilterValues(
  query: MoviesListQuery,
  values: MoviesFilterFormModel,
): MoviesListQuery {
  const [field, direction] = values.sort.split(':');
  return {
    ...query,
    page: 1,
    search: values.search,
    sortBy:
      field === 'createdAt' || field === 'updatedAt' || field === 'externalMovieId'
        ? field
        : query.sortBy,
    sortOrder: direction === 'asc' || direction === 'desc' ? direction : query.sortOrder,
    filters: {
      releaseYearFrom: optionalNumber(values.releaseYearFrom),
      releaseYearTo: optionalNumber(values.releaseYearTo),
      externalMovieId: optionalNumber(values.externalMovieId),
    },
  };
}
function optionalNumber(value: string): number | undefined {
  return value.trim() === '' ? undefined : Number(value);
}
