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
import {
  DEFAULT_MOVIES_LIST_QUERY,
  type MoviesListQuery,
} from '../../../application/queries/movies-list.query';
import { toMovieFilterValues } from '../../mappers/movie-filter-values.mapper';
import type { MoviesFilterForm } from '../../forms/movies-filter.form';
import type { MoviesFilterLabels } from './movies-filter-labels';
import { moviesFilterFields } from './movies-filter-fields';
import { createMoviesFilterForm } from './movies-filter-form';
@Component({
  selector: 'app-movies-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListControls],
  template:
    '<app-list-controls [search]="controller.form.search" [fields]="fields()" [activeCount]="activeCount()" (resetFilters)="reset()" />',
})
export class MoviesFilters {
  private readonly transloco = inject(TranslocoService);
  readonly query = input.required<MoviesListQuery>();
  readonly filtersChange = output<MoviesFilterForm>();
  readonly resetFilters = output();
  private readonly labels = toSignal(
    this.transloco.selectTranslateObject<MoviesFilterLabels>('filters', {}, 'movies'),
  );
  private readonly applied = computed(() => toMovieFilterValues(this.query()), {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  protected readonly controller = createMoviesFilterForm();
  protected readonly fields = computed(() => {
    const labels = this.labels();
    return labels ? moviesFilterFields(labels, this.controller.form) : [];
  });
  protected readonly activeCount = computed(() => {
    const values = this.controller.model();
    return (
      [values.releaseYearFrom, values.releaseYearTo, values.externalMovieId].filter(Boolean)
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
    this.controller.form().reset(toMovieFilterValues(DEFAULT_MOVIES_LIST_QUERY));
    this.resetFilters.emit();
  }
}
