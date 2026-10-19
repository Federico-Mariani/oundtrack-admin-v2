import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, takeUntil } from 'rxjs';
import { resolveRequest } from '@shared/state/request-rxjs';
import { TV_SERIES_REPOSITORY } from '../../tokens/tv-series-repository.token';
import { TvSeriesInfoCreateActions } from '../actions/tv-series-info-create.actions';

export const createTvSeriesInfo$ = createEffect(
  (actions$ = inject(Actions), repository = inject(TV_SERIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(TvSeriesInfoCreateActions.requested),
      exhaustMap(({ request }) =>
        resolveRequest(
          repository.createInfo(request),
          () => TvSeriesInfoCreateActions.succeeded({ request }),
          (error) => TvSeriesInfoCreateActions.failed({ request, error }),
        ).pipe(takeUntil(actions$.pipe(ofType(TvSeriesInfoCreateActions.reset)))),
      ),
    ),
  { functional: true },
);
