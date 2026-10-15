import type { FieldTree } from '@angular/forms/signals';
import type { MoviesFilterFormModel } from '../../models/movies-filter-form.model';
import type { ListFilterField } from '@shared/ui/list-filters/list-filter-field';
import type { MoviesFilterLabels } from './movies-filter-labels';
export function moviesFilterFields(
  labels: MoviesFilterLabels,
  form: FieldTree<MoviesFilterFormModel>,
): ReadonlyArray<ListFilterField> {
  return [
    { key: 'releaseYearFrom', label: labels.yearFrom, kind: 'number', field: form.releaseYearFrom },
    {
      key: 'releaseYearTo',
      label: labels.yearTo,
      kind: 'number',
      field: form.releaseYearTo,
    },
    {
      key: 'externalMovieId',
      label: labels.externalId,
      kind: 'number',
      field: form.externalMovieId,
    },
    {
      key: 'sort',
      field: form.sort,
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
