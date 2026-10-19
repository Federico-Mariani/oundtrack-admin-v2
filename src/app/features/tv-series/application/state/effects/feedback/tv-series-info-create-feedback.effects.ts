import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { TV_SERIES_FEEDBACK_PORT } from '../../../tokens/tv-series-feedback.token';
import { TvSeriesInfoCreateActions } from '../../actions/tv-series-info-create.actions';

export const createTvSeriesInfoSucceededFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(TV_SERIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(TvSeriesInfoCreateActions.succeeded),
      tap(() => {
        feedback.createInfoSucceeded();
      }),
    ),
  { functional: true, dispatch: false },
);

export const createTvSeriesInfoFailedFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(TV_SERIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(TvSeriesInfoCreateActions.failed),
      tap(({ error }) => {
        feedback.createInfoFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
