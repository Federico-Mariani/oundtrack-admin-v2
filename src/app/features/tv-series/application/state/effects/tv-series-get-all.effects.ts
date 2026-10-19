import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, timer } from 'rxjs';
import { resolveRequest } from '@shared/state/request-rxjs';
import { TV_SERIES_REPOSITORY } from '../../tokens/tv-series-repository.token';
import { TvSeriesGetAllActions } from '../actions/tv-series-get-all.actions';

export const getAllTvSeries$ = createEffect(
  (actions$ = inject(Actions), repository = inject(TV_SERIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(TvSeriesGetAllActions.requested),
      switchMap(({ query, debounce }) =>
        timer(debounce ? 300 : 0).pipe(
          switchMap(() =>
            resolveRequest(
              repository.getAll(query),
              (result) => {
                const lastPage = Math.max(1, Math.ceil(result.total / result.limit));

                if (result.page > lastPage) {
                  return TvSeriesGetAllActions.requested({
                    query: { ...query, page: lastPage },
                  });
                }

                return TvSeriesGetAllActions.succeeded({ result, query });
              },
              (error) => TvSeriesGetAllActions.failed({ error, query }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
