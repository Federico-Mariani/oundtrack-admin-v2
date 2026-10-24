import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concat, exhaustMap, filter, map, of, takeUntil } from 'rxjs';
import { RequestErrorCode, type RequestError } from '@shared/state/request/request-error';
import { CATEGORY_MANAGEMENT } from '../../tokens/category-management.token';
import { gameCategoriesFeature } from '../game-categories.feature';
import {
  CategoryEditorEvents as editor,
  CategorySaveActions as save,
} from '../actions/category-save.actions';
import { saveCategoryWorkflow } from '../workflows/save-category.workflow';
export const saveCategory = createEffect(
  (actions$ = inject(Actions), repository = inject(CATEGORY_MANAGEMENT), store = inject(Store)) => {
    const state = store.selectSignal(gameCategoriesFeature['selectGame-categoriesState']);
    return actions$.pipe(
      ofType(save.requested),
      filter(
        (action) =>
          state().editorSessionId === action.sessionId && state().saveId === action.requestId,
      ),
      exhaustMap(({ sessionId, requestId, command }) =>
        concat(
          saveCategoryWorkflow(repository, command, state()).pipe(
            map((event) => editor.progress({ sessionId, requestId, event })),
          ),
          of(save.succeeded({ sessionId, requestId })),
        ).pipe(
          catchError((error: RequestError) =>
            of(
              save.failed({
                sessionId,
                requestId,
                error,
                uncertain:
                  !command.categoryId &&
                  (error.code === RequestErrorCode.Network ||
                    error.code === RequestErrorCode.Server),
              }),
            ),
          ),
          takeUntil(
            actions$.pipe(
              ofType(editor.closed, editor.opened),
              filter(() => state().editorSessionId !== sessionId),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
