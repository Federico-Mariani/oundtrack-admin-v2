import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import { resolveRequest } from '@shared/state/request-rxjs';

export const createMovie$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesCreateActions.requested),
      exhaustMap((model) =>
        resolveRequest(
          repository.create(model.movie),
          (movie) => MoviesCreateActions.succeeded({ movie }),
          (error) => MoviesCreateActions.failed({ error }),
        ),
      ),
    ),
  { functional: true },
);
