import type { TvSeriesFilterFormModel } from '../models/tv-series-filter-form.model';
import type { TvSeriesListQuery } from '../../domain/models/tv-series-list-query.model';

export function toTvSeriesFilterValues(query: TvSeriesListQuery): TvSeriesFilterFormModel {
  return {
    search: query.search,
    releaseYearFrom: String(query.filters.releaseYearFrom ?? ''),
    releaseYearTo: String(query.filters.releaseYearTo ?? ''),
    externalTvSeriesId: String(query.filters.externalTvSeriesId ?? ''),
    sort: `${query.sortBy}:${query.sortOrder}`,
  };
}
export function applyTvSeriesFilterValues(
  query: TvSeriesListQuery,
  values: TvSeriesFilterFormModel,
): TvSeriesListQuery {
  const [field, direction] = values.sort.split(':');

  return {
    ...query,
    page: 1,
    search: values.search,
    sortBy:
      field === 'createdAt' || field === 'updatedAt' || field === 'externalTvSeriesId'
        ? field
        : query.sortBy,
    sortOrder: direction === 'asc' || direction === 'desc' ? direction : query.sortOrder,
    filters: {
      releaseYearFrom: optionalNumber(values.releaseYearFrom),
      releaseYearTo: optionalNumber(values.releaseYearTo),
      externalTvSeriesId: optionalNumber(values.externalTvSeriesId),
    },
  };
}
function optionalNumber(value: string): number | undefined {
  return value.trim() === '' ? undefined : Number(value);
}
