import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { moviesFeature } from '../movies.feature';

@Injectable({ providedIn: 'root' })
export class MoviesStoreDataFacade {
  private readonly store = inject(Store);

  readonly detail = this.store.selectSignal(moviesFeature.selectDetail);
  readonly query = this.store.selectSignal(moviesFeature.selectQuery);
  readonly total = this.store.selectSignal(moviesFeature.selectTotal);
  readonly movies = this.store.selectSignal(moviesFeature.selectMovies);
}
