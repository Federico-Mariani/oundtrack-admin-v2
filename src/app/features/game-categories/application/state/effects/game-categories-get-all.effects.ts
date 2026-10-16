import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { resolveRequest } from '@shared/state/request-rxjs';
import { GAME_CATEGORIES_REPOSITORY } from '../../tokens/game-categories-repository.token';
import { GameCategoriesGetAllActions } from '../actions/game-categories-get-all.actions';

export const getAllGameCategories$ = createEffect(
  (actions$ = inject(Actions), repository = inject(GAME_CATEGORIES_REPOSITORY)) =>
    actions$.pipe(
      ofType(GameCategoriesGetAllActions.requested),
      switchMap(() =>
        resolveRequest(
          repository.getAll(),
          (categories) => GameCategoriesGetAllActions.succeeded({ categories }),
          (error) => GameCategoriesGetAllActions.failed({ error }),
        ),
      ),
    ),
  { functional: true },
);
