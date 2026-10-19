import type { FieldTree } from '@angular/forms/signals';
import type { ListFilterField } from '@shared/ui/list-filters/list-filter-field';
import type { TvSeriesFilterLabels } from './tv-series-filter-labels';
import type { TvSeriesFilterFormModel } from '../../models/tv-series-filter-form.model';

export function tvSeriesFilterFields(
  labels: TvSeriesFilterLabels,
  form: FieldTree<TvSeriesFilterFormModel>,
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
      key: 'externalTvSeriesId',
      label: labels.externalId,
      kind: 'number',
      field: form.externalTvSeriesId,
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
        { value: 'externalTvSeriesId:asc', label: labels.idAscending },
        { value: 'externalTvSeriesId:desc', label: labels.idDescending },
      ],
    },
  ];
}
