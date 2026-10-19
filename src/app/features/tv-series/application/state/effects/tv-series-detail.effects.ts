import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, switchMap, takeUntil } from 'rxjs';
import { resolveRequest } from '@shared/state/request-rxjs';
import { TV_SERIES_REPOSITORY } from '../../tokens/tv-series-repository.token';
import { TvSeriesDetailActions } from '../actions/tv-series-detail.actions';
import { TvSeriesDetailApiActions } from '../actions/api/tv-series-detail-api.actions';

export const loadTvSeriesDetail$ = createEffect(
  (actions$ = inject(Actions), repository = inject(TV_SERIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(TvSeriesDetailActions.requested),
      switchMap(({ id }) =>
        resolveRequest(
          repository.getOne(id),
          (tv) => TvSeriesDetailApiActions.succeeded({ id, tv }),
          (error) => TvSeriesDetailApiActions.failed({ id, error }),
        ).pipe(
          takeUntil(
            actions$.pipe(
              ofType(TvSeriesDetailActions.closed),
              filter((action) => action.id === id),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
