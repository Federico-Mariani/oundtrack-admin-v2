import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { TV_SERIES_FEEDBACK_PORT } from '../../../tokens/tv-series-feedback.token';
import { TvSeriesGetAllActions } from '../../actions/tv-series-get-all.actions';

export const tvSeriesGetAllFeedback$ = createEffect(
  (actions$ = inject(Actions), feedback = inject(TV_SERIES_FEEDBACK_PORT)) =>
    actions$.pipe(
      ofType(TvSeriesGetAllActions.failed),
      tap(({ error }) => {
        feedback.getAllTvSeriesFailed(error);
      }),
    ),
  { functional: true, dispatch: false },
);
