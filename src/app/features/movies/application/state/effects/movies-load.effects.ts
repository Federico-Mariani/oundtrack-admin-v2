import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, timer } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesGetAllActions } from '../actions/movies-get-all.actions';
import { resolveRequest } from '@shared/state/request-rxjs';

export const loadMovies$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesGetAllActions.requested),
      switchMap(({ query, debounce }) =>
        timer(debounce ? 300 : 0).pipe(
          switchMap(() =>
            resolveRequest(
              repository.getAll(query),
              (result) => {
                const lastPage = Math.max(1, Math.ceil(result.total / result.limit));

                if (result.page > lastPage) {
                  return MoviesGetAllActions.requested({
                    query: { ...query, page: lastPage },
                  });
                }

                return MoviesGetAllActions.succeeded({ result, query });
              },
              (error) => MoviesGetAllActions.failed({ error, query }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
