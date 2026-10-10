import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { moviesFeature } from '../movies.feature';

/** Read-only auth data as Signals. Never dispatches. */
@Injectable({ providedIn: 'root' })
export class MoviesStoreDataFacade {
  private readonly store = inject(Store);

  readonly movies = this.store.selectSignal(moviesFeature.selectMovies);
}
