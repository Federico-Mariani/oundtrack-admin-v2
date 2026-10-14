import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { ListFilters } from '@shared/ui/list-filters/list-filters';
import type { MoviesListQuery } from '../../../domain/models/movies-list-query.model';
import { toMovieFilterValues } from '../../mappers/movie-filter-values.mapper';
import type { MoviesFilterLabels } from './movies-filter-labels';
import { moviesFilterFields } from './movies-filter-fields';

@Component({
  selector: 'app-movies-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListFilters],
  template:
    '<app-list-filters [fields]="fields()" [values]="values()" (applyFilters)="applyFilters.emit($event)" (resetFilters)="resetFilters.emit()" />',
})
export class MoviesFilters {
  readonly query = input.required<MoviesListQuery>();
  readonly applyFilters = output<Readonly<Record<string, string>>>();
  readonly resetFilters = output();
  private readonly labels = toSignal(
    inject(TranslocoService).selectTranslateObject<MoviesFilterLabels>('filters', {}, 'movies'),
  );
  protected readonly fields = computed(() => {
    const labels = this.labels();
    return labels ? moviesFilterFields(labels) : [];
  });
  protected readonly values = computed(() => toMovieFilterValues(this.query()), {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
}
