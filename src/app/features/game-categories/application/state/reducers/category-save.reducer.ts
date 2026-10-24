import { on } from '@ngrx/store';
import {
  CategoryEditorEvents as editor,
  CategorySaveActions as save,
} from '../actions/category-save.actions';
import type { GameCategoriesState } from '../game-categories.state';
import {
  idleRequest,
  pendingRequest,
  failedRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { CategorySavePhase as Phase } from '../../workflows/category-save.phase';
import { CategorySaveEventKind as Kind } from '../workflows/category-save-event.workflow';
function reset(state: GameCategoriesState, sessionId: string | null): GameCategoriesState {
  return {
    ...state,
    editorSessionId: sessionId,
    saveId: null,
    saveRequest: idleRequest(),
    preparedCategory: null,
    categoryProgress: null,
    categoryPhase: Phase.Idle,
    uploadedCategoryFile: null,
    categoryUploadKey: null,
    categoryCreationUncertain: false,
  };
}
function accepts(state: GameCategoriesState, sessionId: string, requestId: string): boolean {
  return (
    state.editorSessionId === sessionId &&
    state.saveId === requestId &&
    isRequestPending(state.saveRequest)
  );
}
export const categorySaveReducer = [
  on(editor.opened, (state: GameCategoriesState, { sessionId }) => reset(state, sessionId)),
  on(editor.closed, (state: GameCategoriesState, { sessionId }) =>
    state.editorSessionId === sessionId ? reset(state, null) : state,
  ),
  on(save.requested, (state: GameCategoriesState, { sessionId, requestId }): GameCategoriesState =>
    state.editorSessionId !== sessionId ||
    isRequestPending(state.saveRequest) ||
    state.categoryCreationUncertain
      ? state
      : {
          ...state,
          saveId: requestId,
          saveRequest: pendingRequest(),
          categoryPhase: Phase.Names,
          categoryProgress: null,
        },
  ),
  on(
    editor.progress,
    (state: GameCategoriesState, { sessionId, requestId, event }): GameCategoriesState => {
      if (!accepts(state, sessionId, requestId)) return state;
      if (event.kind === Kind.Progress)
        return { ...state, categoryPhase: Phase.Upload, categoryProgress: event.progress };
      if (event.kind === Kind.Uploaded)
        return {
          ...state,
          categoryPhase: Phase.Confirm,
          categoryProgress: 100,
          uploadedCategoryFile: event.fileKey,
          categoryUploadKey: event.key,
        };
      const category = event.category;
      return {
        ...state,
        preparedCategory: category,
        categories: [...state.categories.filter((item) => item.id !== category.id), category],
      };
    },
  ),
  on(save.succeeded, (state: GameCategoriesState, { sessionId, requestId }): GameCategoriesState =>
    accepts(state, sessionId, requestId)
      ? { ...state, saveRequest: succeededRequest(), categoryPhase: Phase.Idle }
      : state,
  ),
  on(
    save.failed,
    (
      state: GameCategoriesState,
      { sessionId, requestId, error, uncertain },
    ): GameCategoriesState =>
      !accepts(state, sessionId, requestId)
        ? state
        : {
            ...state,
            saveRequest: failedRequest(error),
            categoryCreationUncertain: uncertain && !state.preparedCategory,
            uploadedCategoryFile:
              error.code === RequestErrorCode.Conflict ? null : state.uploadedCategoryFile,
            categoryUploadKey:
              error.code === RequestErrorCode.Conflict ? null : state.categoryUploadKey,
          },
  ),
];
