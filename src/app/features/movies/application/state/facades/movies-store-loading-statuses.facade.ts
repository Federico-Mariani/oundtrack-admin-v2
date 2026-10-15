import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { moviesFeature } from '../movies.feature';

/** Per-operation loading flags as Signals; the logic lives in `authFeature` extra selectors. */
@Injectable({ providedIn: 'root' })
export class MoviesStoreLoadingStatusesFacade {
  private readonly store = inject(Store);

  readonly isCreatingInfo = this.store.selectSignal(moviesFeature.selectIsCreatingInfo);
  readonly isLoadingDetail = this.store.selectSignal(moviesFeature.selectIsLoadingDetail);
  readonly isCreatingMovie = this.store.selectSignal(moviesFeature.selectIsCreatingMovie);
  readonly isLoadingMovies = this.store.selectSignal(moviesFeature.selectIsLoadingMovies);
}
