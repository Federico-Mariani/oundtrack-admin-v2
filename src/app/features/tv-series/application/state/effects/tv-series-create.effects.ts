import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import { resolveRequest } from '@shared/state/request-rxjs';
import { TV_SERIES_REPOSITORY } from '../../tokens/tv-series-repository.token';
import { TvSeriesCreateActions } from '../actions/tv-series-create.actions';

export const createTvSeries$ = createEffect(
  (actions$ = inject(Actions), repository = inject(TV_SERIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(TvSeriesCreateActions.requested),
      exhaustMap(({ tvSeries }) =>
        resolveRequest(
          repository.create(tvSeries),
          (tvSeries) => TvSeriesCreateActions.succeeded({ tvSeries }),
          (error) => TvSeriesCreateActions.failed({ error }),
        ),
      ),
    ),
  { functional: true },
);
