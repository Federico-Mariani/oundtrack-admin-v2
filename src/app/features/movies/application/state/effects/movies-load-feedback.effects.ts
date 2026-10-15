import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MOVIES_FEEDBACK_PORT } from '../../tokens/movies-feedback.token';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';

export const moviesLoadFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(MOVIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(MoviesLoadApiActions.moviesLoadFailed),
      tap(({ error }) => {
        feedback.loadMoviesFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
