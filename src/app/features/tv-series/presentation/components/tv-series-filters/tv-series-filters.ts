import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { ListControls } from '@shared/ui/list-controls/list-controls';
import { tvSeriesFilterFields } from './tv-series-filter-fields';
import type { TvSeriesFilterForm } from '../../forms/tv-series-filter.form';
import type { TvSeriesFilterLabels } from './tv-series-filter-labels';
import {
  DEFAULT_TV_SERIES_LIST_QUERY,
  type TvSeriesListQuery,
} from '../../../application/queries/tv-series-list.query';
import { createTvSeriesFilterForm } from './tv-series-filter-form';
import { toTvSeriesFilterValues } from '../../mappers/tv-series-filter-values.mapper';

@Component({
  selector: 'app-tv-series-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListControls],
  template:
    '<app-list-controls [search]="controller.form.search" [fields]="fields()" [activeCount]="activeCount()" (resetFilters)="reset()" />',
})
export class TvSeriesFilters {
  private readonly transloco = inject(TranslocoService);
  readonly query = input.required<TvSeriesListQuery>();
  readonly filtersChange = output<TvSeriesFilterForm>();
  readonly resetFilters = output();
  private readonly labels = toSignal(
    this.transloco.selectTranslateObject<TvSeriesFilterLabels>('filters', {}, 'tvSeries'),
  );
  private readonly applied = computed(() => toTvSeriesFilterValues(this.query()), {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  protected readonly controller = createTvSeriesFilterForm();
  protected readonly fields = computed(() => {
    const labels = this.labels();
    return labels ? tvSeriesFilterFields(labels, this.controller.form) : [];
  });
  protected readonly activeCount = computed(() => {
    const values = this.controller.model();
    return (
      [values.releaseYearFrom, values.releaseYearTo, values.externalTvSeriesId].filter(Boolean)
        .length + (values.sort && values.sort !== 'createdAt:desc' ? 1 : 0)
    );
  });
  constructor() {
    effect(() => {
      const applied = this.applied();
      untracked(() => {
        if (JSON.stringify(applied) !== JSON.stringify(this.controller.model())) {
          this.controller.form().reset(applied);
        }
      });
    });
    effect(() => {
      const values = this.controller.model();
      const valid = this.controller.form().valid();
      untracked(() => {
        if (valid && JSON.stringify(values) !== JSON.stringify(this.applied())) {
          this.filtersChange.emit(values);
        }
      });
    });
  }
  protected reset(): void {
    this.controller.form().reset(toTvSeriesFilterValues(DEFAULT_TV_SERIES_LIST_QUERY));
    this.resetFilters.emit();
  }
}
