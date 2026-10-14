import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, takeUntil } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import { MoviesCreateApiActions } from '../actions/api/movies-create-api.actions';
import type { RequestError } from '@shared/state/request/request-error';
export const createMovie$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesCreateActions.submitted),
      exhaustMap(({ movie }) =>
        repository.create(movie).pipe(
          map((movie) => MoviesCreateApiActions.succeeded({ movie })),
          catchError((error: RequestError) => of(MoviesCreateApiActions.failed({ error }))),
          takeUntil(actions$.pipe(ofType(MoviesCreateActions.reset))),
        ),
      ),
    ),
  { functional: true },
);
