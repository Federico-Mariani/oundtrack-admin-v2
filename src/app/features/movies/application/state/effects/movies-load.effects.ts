import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesLoadActions } from '../actions/movies-load.actions';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';
import type { RequestError } from '@shared/state/request/request-error';

export const loadMovies$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesLoadActions.moviesLoadRequested),
      exhaustMap(() =>
        repository.getAll().pipe(
          map((movies) => MoviesLoadApiActions.moviesLoaded({ movies })),
          catchError((error: RequestError) => of(MoviesLoadApiActions.moviesLoadFailed({ error }))),
        ),
      ),
    ),
  { functional: true },
);
