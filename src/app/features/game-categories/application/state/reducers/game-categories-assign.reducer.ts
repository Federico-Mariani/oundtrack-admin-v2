import type { RequestError } from '@shared/state/request/request-error';
import {
  GameCategoriesAssignActions as assign,
  GameCategoriesEditorEvents as editor,
} from '../actions/game-categories-assign.actions';
import {
  idleRequest,
  pendingRequest,
  succeededRequest,
  failedRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import { on } from '@ngrx/store';
import type { GameCategoriesState } from '../game-categories.state';
export const gameCategoriesAssignReducer = [
  on(editor.opened, (state: GameCategoriesState, { sessionId }) => ({
    ...state,
    assignmentSessionId: sessionId,
    assignmentId: null,
    assignmentRequest: idleRequest<RequestError>(),
  })),
  on(editor.closed, (state: GameCategoriesState, { sessionId }) =>
    state.assignmentSessionId !== sessionId
      ? state
      : {
          ...state,
          assignmentSessionId: null,
          assignmentId: null,
          assignmentRequest: idleRequest<RequestError>(),
        },
  ),
  on(assign.requested, (state: GameCategoriesState, { sessionId, requestId }) =>
    state.assignmentSessionId !== sessionId || isRequestPending(state.assignmentRequest)
      ? state
      : { ...state, assignmentId: requestId, assignmentRequest: pendingRequest<RequestError>() },
  ),
  on(assign.succeeded, (state: GameCategoriesState, { sessionId, requestId }) =>
    state.assignmentSessionId !== sessionId ||
    state.assignmentId !== requestId ||
    !isRequestPending(state.assignmentRequest)
      ? state
      : { ...state, assignmentRequest: succeededRequest<RequestError>() },
  ),
  on(assign.failed, (state: GameCategoriesState, { sessionId, requestId, error }) =>
    state.assignmentSessionId !== sessionId ||
    state.assignmentId !== requestId ||
    !isRequestPending(state.assignmentRequest)
      ? state
      : { ...state, assignmentRequest: failedRequest(error) },
  ),
];
