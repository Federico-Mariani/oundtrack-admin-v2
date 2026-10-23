import { HintSavePhase } from '../workflows/hint-save.phase';
import { HintSaveEventKind } from './workflows/hint-save-event.workflow';
import { RequestErrorCode } from '@shared/state/request/request-error';
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
  HintsIconsActions as icons,
  HintsSaveProgressEvents,
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
  on(icons.requested, (state, { sessionId, requestId }): HintsState =>
    state.sessionId !== sessionId
      ? state
      : { ...state, iconsId: requestId, iconsRequest: pendingRequest() },
  ),
  on(icons.succeeded, (state, { sessionId, requestId, icons }): HintsState =>
    state.sessionId !== sessionId ||
    state.iconsId !== requestId ||
    !isRequestPending(state.iconsRequest)
      ? state
      : { ...state, icons, iconsRequest: succeededRequest() },
  ),
  on(icons.failed, (state, { sessionId, requestId, error }): HintsState =>
    state.sessionId !== sessionId ||
    state.iconsId !== requestId ||
    !isRequestPending(state.iconsRequest)
      ? state
      : { ...state, iconsRequest: failedRequest(error) },
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
      : {
          ...state,
          saveId: null,
          command: null,
          saveRequest: idleRequest(),
          preparedHint: null,
          uploadedFileKey: null,
          progress: null,
          phase: HintSavePhase.Idle,
          creationUncertain: false,
        },
  ),
  on(save.requested, (state, { sessionId, requestId, command }): HintsState =>
    state.creationUncertain ||
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
          phase: HintSavePhase.Preparing,
          progress: null,
          loadId: null,
          loadRequest: idleRequest(),
        },
  ),
  on(HintsSaveProgressEvents.changed, (state, { sessionId, requestId, event }): HintsState => {
    if (
      state.sessionId !== sessionId ||
      state.saveId !== requestId ||
      !isRequestPending(state.saveRequest)
    )
      return state;
    switch (event.kind) {
      case HintSaveEventKind.Localized:
      case HintSaveEventKind.Prepared:
        return {
          ...state,
          preparedHint: event.hint,
          hints: [...state.hints.filter((hint) => hint.id !== event.hint.id), event.hint],
          phase:
            event.kind === HintSaveEventKind.Localized
              ? HintSavePhase.Localizing
              : HintSavePhase.Uploading,
        };
      case HintSaveEventKind.Progress:
        return { ...state, progress: event.progress, phase: HintSavePhase.Uploading };
      case HintSaveEventKind.Uploaded:
        return {
          ...state,
          uploadedFileKey: event.fileKey,
          phase: HintSavePhase.Confirming,
          progress: null,
        };
      case HintSaveEventKind.Completed:
        return state;
    }
  }),
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
    return { ...state, hints, saveRequest: succeededRequest(), phase: HintSavePhase.Done };
  }),
  on(save.failed, (state, { sessionId, requestId, error }): HintsState =>
    state.sessionId !== sessionId ||
    state.saveId !== requestId ||
    !isRequestPending(state.saveRequest)
      ? state
      : {
          ...state,
          saveRequest: failedRequest(error),
          uploadedFileKey: error.status === 409 ? null : state.uploadedFileKey,
          creationUncertain:
            !state.preparedHint &&
            (state.command?.mode === HintEditorMode.Create ||
              state.command?.mode === HintEditorMode.Translate) &&
            (error.code === RequestErrorCode.Network ||
              error.code === RequestErrorCode.Server ||
              error.code === RequestErrorCode.Unknown),
        },
  ),
);
