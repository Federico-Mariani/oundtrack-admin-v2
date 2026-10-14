import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { moviesFeature } from '../movies.feature';

/** Per-operation errors as Signals; errors of different operations can coexist. */
@Injectable({ providedIn: 'root' })
export class MoviesStoreErrorStatusesFacade {
  private readonly store = inject(Store);

  readonly createMovie = this.store.selectSignal(moviesFeature.selectMovieCreateError);
  readonly loadMovies = this.store.selectSignal(moviesFeature.selectMoviesLoadError);
}
