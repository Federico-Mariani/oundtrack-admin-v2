import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { TV_SERIES_FEEDBACK_PORT } from '../../../tokens/tv-series-feedback.token';
import { TvSeriesCreateActions } from '../../actions/tv-series-create.actions';

export const createTvSeriesSucceededFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(TV_SERIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(TvSeriesCreateActions.succeeded),
      tap(() => {
        feedback.createTvSeriesSucceeded();
      }),
    ),
  { functional: true, dispatch: false },
);

export const createTvSeriesFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(TV_SERIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(TvSeriesCreateActions.failed),
      tap(({ error }) => {
        feedback.createTvSeriesFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
