import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, takeUntil } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import { resolveRequest } from '@shared/state/request-rxjs';

export const createMovieInfo$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesInfoCreateActions.requested),
      exhaustMap(({ request }) =>
        resolveRequest(
          repository.createInfo(request),
          () => MoviesInfoCreateActions.succeeded({ request }),
          (error) => MoviesInfoCreateActions.failed({ request, error }),
        ).pipe(takeUntil(actions$.pipe(ofType(MoviesInfoCreateActions.reset)))),
      ),
    ),
  { functional: true },
);
