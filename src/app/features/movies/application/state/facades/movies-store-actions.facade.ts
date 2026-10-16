import type { CreateMovieInfoModel } from '../../../domain/models/create-movie-info.model';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import type { Id } from '@shared/types/id';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import type { CreateMovieModel } from '../../../domain/models/create-movie.model';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import type { MoviesListQuery } from '../../../domain/models/movies-list-query.model';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MoviesGetAllActions } from '../actions/movies-get-all.actions';

@Injectable({ providedIn: 'root' })
export class MoviesStoreActionsFacade {
  private readonly store = inject(Store);

  createInfo(request: CreateMovieInfoModel): void {
    this.store.dispatch(MoviesInfoCreateActions.requested({ request }));
  }
  resetCreateInfo(): void {
    this.store.dispatch(MoviesInfoCreateActions.reset());
  }
  loadDetail(id: Id): void {
    this.store.dispatch(MoviesDetailActions.requested({ id }));
  }
  closeDetail(id: Id): void {
    this.store.dispatch(MoviesDetailActions.closed({ id }));
  }
  createMovie(movie: CreateMovieModel): void {
    this.store.dispatch(MoviesCreateActions.requested({ movie }));
  }
  resetCreateMovie(): void {
    this.store.dispatch(MoviesCreateActions.reset());
  }
  loadMovies(query: MoviesListQuery, debounce = false): void {
    this.store.dispatch(MoviesGetAllActions.requested({ query, debounce }));
  }
}
