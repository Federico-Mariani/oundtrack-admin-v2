import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MoviesLoadActions } from '../actions/movies-load.actions';

@Injectable({ providedIn: 'root' })
export class MoviesStoreActionsFacade {
  private readonly store = inject(Store);

  loadMovies(): void {
    this.store.dispatch(MoviesLoadActions.moviesLoadRequested());
  }
}
