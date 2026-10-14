import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import { MoviesDetailApiActions } from '../actions/api/movies-detail-api.actions';
import type { RequestError } from '@shared/state/request/request-error';
export const loadMovieDetail$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesDetailActions.requested),
      switchMap(({ id }) =>
        repository.getOne(id).pipe(
          map((movie) => MoviesDetailApiActions.succeeded({ id, movie })),
          catchError((error: RequestError) => of(MoviesDetailApiActions.failed({ id, error }))),
          takeUntil(
            actions$.pipe(
              ofType(MoviesDetailActions.closed),
              filter((action) => action.id === id),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
