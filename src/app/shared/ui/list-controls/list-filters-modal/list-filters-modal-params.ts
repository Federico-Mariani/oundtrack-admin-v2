import type { Signal } from '@angular/core';
import type { ListFilterField } from '../../list-filters/list-filter-field';

export interface ListFiltersModalParams {
  readonly fields: Signal<ReadonlyArray<ListFilterField>>;
  readonly reset: () => void;
}
