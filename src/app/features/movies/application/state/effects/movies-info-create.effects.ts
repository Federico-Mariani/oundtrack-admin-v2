import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, takeUntil } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import { MoviesInfoCreateApiActions } from '../actions/api/movies-info-create-api.actions';
import type { RequestError } from '@shared/state/request/request-error';
export const createMovieInfo$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesInfoCreateActions.submitted),
      exhaustMap(({ request }) =>
        repository.createInfo(request).pipe(
          map(() => MoviesInfoCreateApiActions.succeeded({ request })),
          catchError((error: RequestError) =>
            of(MoviesInfoCreateApiActions.failed({ request, error })),
          ),
          takeUntil(actions$.pipe(ofType(MoviesInfoCreateActions.reset))),
        ),
      ),
    ),
  { functional: true },
);
