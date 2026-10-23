import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, takeUntil } from 'rxjs';
import type { RequestError } from '@shared/state/request/request-error';
import { GAME_CATEGORIES_REPOSITORY } from '../../tokens/game-categories-repository.token';
import {
  GameCategoriesAssignActions as assign,
  GameCategoriesEditorEvents as editor,
} from '../actions/game-categories-assign.actions';
import { gameCategoriesFeature } from '../game-categories.feature';
export const assignGameCategories = createEffect(
  (
    actions$ = inject(Actions),
    repository = inject(GAME_CATEGORIES_REPOSITORY),
    store = inject(Store),
  ) => {
    const session = store.selectSignal(gameCategoriesFeature.selectAssignmentSessionId);
    const request = store.selectSignal(gameCategoriesFeature.selectAssignmentId);
    return actions$.pipe(
      ofType(assign.requested),
      filter(({ sessionId, requestId }) => session() === sessionId && request() === requestId),
      exhaustMap(({ sessionId, requestId, command }) =>
        repository.setForOwner(command).pipe(
          map(() => assign.succeeded({ sessionId, requestId })),
          catchError((error: RequestError) => of(assign.failed({ sessionId, requestId, error }))),
          takeUntil(
            actions$.pipe(
              ofType(editor.closed, editor.opened),
              filter(() => session() !== sessionId),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
