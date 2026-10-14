import type { CreateMovieModel } from '../../../domain/models/create-movie.model';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import type { MoviesListQuery } from '../../../domain/models/movies-list-query.model';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MoviesLoadActions } from '../actions/movies-load.actions';

@Injectable({ providedIn: 'root' })
export class MoviesStoreActionsFacade {
  private readonly store = inject(Store);

  createMovie(movie: CreateMovieModel): void {
    this.store.dispatch(MoviesCreateActions.submitted({ movie }));
  }
  resetCreateMovie(): void {
    this.store.dispatch(MoviesCreateActions.reset());
  }
  loadMovies(query: MoviesListQuery, debounce = false): void {
    this.store.dispatch(MoviesLoadActions.moviesLoadRequested({ query, debounce }));
  }
}
