import type { ListFilterField } from '@shared/ui/list-filters/list-filter-field';
import type { MoviesFilterLabels } from './movies-filter-labels';
export function moviesFilterFields(labels: MoviesFilterLabels): readonly ListFilterField[] {
  return [
    {
      key: 'infoLanguage',
      label: labels.language,
      kind: 'select',
      options: [
        { value: '', label: labels.anyLanguage },
        { value: 'it-IT', label: labels.italian },
        { value: 'en-US', label: labels.english },
      ],
    },
    { key: 'releaseYearFrom', label: labels.yearFrom, kind: 'number', min: 1, max: 9998 },
    {
      key: 'releaseYearTo',
      label: labels.yearTo,
      kind: 'number',
      min: 1,
      max: 9998,
      rangeStartKey: 'releaseYearFrom',
    },
    { key: 'externalMovieId', label: labels.externalId, kind: 'number', min: 1, max: 2147483647 },
    {
      key: 'sort',
      label: labels.sort,
      kind: 'select',
      options: [
        { value: 'createdAt:desc', label: labels.newest },
        { value: 'createdAt:asc', label: labels.oldest },
        { value: 'updatedAt:desc', label: labels.recentlyUpdated },
        { value: 'updatedAt:asc', label: labels.leastRecentlyUpdated },
        { value: 'externalMovieId:asc', label: labels.idAscending },
        { value: 'externalMovieId:desc', label: labels.idDescending },
      ],
    },
  ];
}
