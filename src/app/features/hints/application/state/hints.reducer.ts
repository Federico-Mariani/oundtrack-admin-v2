import { createReducer, on } from '@ngrx/store';
import {
  idleRequest,
  pendingRequest,
  succeededRequest,
  failedRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import { initialHintsState, type HintsState } from './hints.state';
import {
  HintsPanelEvents as panel,
  HintsLoadActions as load,
  HintsSaveActions as save,
} from './actions/hints.actions';
import { HintEditorMode } from '../workflows/hint-editor.mode';
export const hintsReducer = createReducer(
  initialHintsState,
  on(panel.opened, (_, { sessionId, owner }): HintsState => ({
    ...initialHintsState,
    sessionId,
    owner,
  })),
  on(panel.closed, (state, { sessionId }): HintsState =>
    state.sessionId === sessionId ? initialHintsState : state,
  ),
  on(load.requested, (state, { sessionId, requestId, ownerId }): HintsState =>
    state.sessionId !== sessionId ||
    state.owner?.id !== ownerId ||
    isRequestPending(state.saveRequest)
      ? state
      : { ...state, loadId: requestId, loadRequest: pendingRequest() },
  ),
  on(load.succeeded, (state, { sessionId, requestId, hints }): HintsState =>
    state.sessionId !== sessionId ||
    state.loadId !== requestId ||
    !isRequestPending(state.loadRequest)
      ? state
      : { ...state, hints, loaded: true, loadRequest: succeededRequest() },
  ),
  on(load.failed, (state, { sessionId, requestId, error }): HintsState =>
    state.sessionId !== sessionId ||
    state.loadId !== requestId ||
    !isRequestPending(state.loadRequest)
      ? state
      : { ...state, loadRequest: failedRequest(error) },
  ),
  on(save.reset, (state): HintsState =>
    isRequestPending(state.saveRequest)
      ? state
      : { ...state, saveId: null, command: null, saveRequest: idleRequest() },
  ),
  on(save.requested, (state, { sessionId, requestId, command }): HintsState =>
    state.sessionId !== sessionId ||
    state.owner?.id !== command.owner.id ||
    state.owner.type !== command.owner.type ||
    isRequestPending(state.saveRequest)
      ? state
      : {
          ...state,
          saveId: requestId,
          command,
          saveRequest: pendingRequest(),
          loadId: null,
          loadRequest: idleRequest(),
        },
  ),
  on(save.succeeded, (state, { sessionId, requestId, hint }): HintsState => {
    if (
      state.sessionId !== sessionId ||
      state.saveId !== requestId ||
      !isRequestPending(state.saveRequest)
    ) {
      return state;
    }
    const command = state.command;
    const hints = hint
      ? [...state.hints.filter((item) => item.id !== hint.id), hint]
      : command?.mode === HintEditorMode.Delete
        ? state.hints.filter((item) => item.id !== command.hintId)
        : state.hints;
    return { ...state, hints, saveRequest: succeededRequest() };
  }),
  on(save.failed, (state, { sessionId, requestId, error }): HintsState =>
    state.sessionId !== sessionId ||
    state.saveId !== requestId ||
    !isRequestPending(state.saveRequest)
      ? state
      : { ...state, saveRequest: failedRequest(error) },
  ),
);
