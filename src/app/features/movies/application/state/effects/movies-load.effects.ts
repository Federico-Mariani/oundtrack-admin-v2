import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of, timer } from 'rxjs';
import { MOVIES_REPOSITORY } from '../../tokens/movies-repository.token';
import { MoviesLoadActions } from '../actions/movies-load.actions';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';
import type { RequestError } from '@shared/state/request/request-error';

export const loadMovies$ = createEffect(
  (actions$ = inject(Actions), repository = inject(MOVIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(MoviesLoadActions.moviesLoadRequested),
      // A new intent immediately cancels both the previous debounce and HTTP request.
      switchMap(({ query, debounce }) =>
        timer(debounce ? 300 : 0).pipe(
          switchMap(() => repository.getAll(query)),
          map((result) => {
            const lastPage = Math.max(1, Math.ceil(result.total / result.limit));
            return result.page > lastPage
              ? MoviesLoadActions.moviesLoadRequested({ query: { ...query, page: lastPage } })
              : MoviesLoadApiActions.moviesLoaded({ result, query });
          }),
          catchError((error: RequestError) =>
            of(MoviesLoadApiActions.moviesLoadFailed({ error, query })),
          ),
        ),
      ),
    ),
  { functional: true },
);
