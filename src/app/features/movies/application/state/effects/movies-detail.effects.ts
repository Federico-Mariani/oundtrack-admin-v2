import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, switchMap, takeUntil } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import { MoviesDetailApiActions } from '../actions/api/movies-detail-api.actions';
import { resolveRequest } from '@shared/state/request-rxjs';

export const loadMovieDetail$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesDetailActions.requested),
      switchMap(({ id }) =>
        resolveRequest(
          repository.getOne(id),
          (movie) => MoviesDetailApiActions.succeeded({ id, movie }),
          (error) => MoviesDetailApiActions.failed({ id, error }),
        ).pipe(
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
