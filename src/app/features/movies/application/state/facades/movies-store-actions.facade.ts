import type { CreateMovieInfoCommand } from '../../commands/create-movie-info.command';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import type { Id } from '@shared/types/id';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import type { CreateMovieCommand } from '../../commands/create-movie.command';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import type { MoviesListQuery } from '../../queries/movies-list.query';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MoviesGetAllActions } from '../actions/movies-get-all.actions';

@Injectable({ providedIn: 'root' })
export class MoviesStoreActionsFacade {
  private readonly store = inject(Store);

  createInfo(request: CreateMovieInfoCommand): void {
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
  createMovie(movie: CreateMovieCommand): void {
    this.store.dispatch(MoviesCreateActions.requested({ movie }));
  }
  resetCreateMovie(): void {
    this.store.dispatch(MoviesCreateActions.reset());
  }
  loadMovies(query: MoviesListQuery, debounce = false): void {
    this.store.dispatch(MoviesGetAllActions.requested({ query, debounce }));
  }
}
