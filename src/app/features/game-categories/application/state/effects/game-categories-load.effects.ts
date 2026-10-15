import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import type { RequestError } from '@shared/state/request/request-error';
import { GAME_CATEGORIES_REPOSITORY } from '../../tokens/game-categories-repository.token';
import { GameCategoriesLoadActions } from '../actions/game-categories-load.actions';
import { GameCategoriesLoadApiActions } from '../actions/api/game-categories-load-api.actions';

export const loadGameCategories$ = createEffect(
  (actions$ = inject(Actions), repository = inject(GAME_CATEGORIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(GameCategoriesLoadActions.gameCategoriesLoadRequested),
      switchMap(() =>
        repository.getAll().pipe(
          map((categories) => GameCategoriesLoadApiActions.gameCategoriesLoaded({ categories })),
          catchError((error: RequestError) =>
            of(GameCategoriesLoadApiActions.gameCategoriesLoadFailed({ error })),
          ),
        ),
      ),
    ),
  { functional: true },
);
