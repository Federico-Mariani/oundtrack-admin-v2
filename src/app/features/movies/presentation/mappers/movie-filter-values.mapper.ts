import { isSupportedLocale } from '@shared/localization/supported-locale';
import type { MoviesListQuery } from '../../domain/models/movies-list-query.model';
export function toMovieFilterValues(query: MoviesListQuery): Readonly<Record<string, string>> {
  return {
    infoLanguage: query.filters.infoLanguage ?? '',
    releaseYearFrom: String(query.filters.releaseYearFrom ?? ''),
    releaseYearTo: String(query.filters.releaseYearTo ?? ''),
    externalMovieId: String(query.filters.externalMovieId ?? ''),
    sort: `${query.sortBy}:${query.sortOrder}`,
  };
}
export function applyMovieFilterValues(
  query: MoviesListQuery,
  values: Readonly<Record<string, string>>,
): MoviesListQuery {
  const [field, direction] = (values['sort'] ?? '').split(':');
  const sortBy =
    field === 'createdAt' || field === 'updatedAt' || field === 'externalMovieId'
      ? field
      : query.sortBy;
  const sortOrder = direction === 'asc' || direction === 'desc' ? direction : query.sortOrder;
  const language = values['infoLanguage'] ?? '';
  return {
    ...query,
    page: 1,
    sortBy,
    sortOrder,
    filters: {
      infoLanguage: isSupportedLocale(language) ? language : undefined,
      releaseYearFrom: optionalNumber(values['releaseYearFrom']),
      releaseYearTo: optionalNumber(values['releaseYearTo']),
      externalMovieId: optionalNumber(values['externalMovieId']),
    },
  };
}
function optionalNumber(value: string | undefined): number | undefined {
  return value === undefined || value.trim() === '' ? undefined : Number(value);
}
