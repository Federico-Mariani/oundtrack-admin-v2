import { on } from '@ngrx/store';
import {
  AvatarEditorEvents as editor,
  AvatarSaveActions as save,
} from '../actions/avatar-save.actions';
import type { AvatarsState } from '../avatars.state';
import {
  idleRequest,
  pendingRequest,
  failedRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { AvatarSavePhase as Phase } from '../../workflows/avatar-save.phase';
function reset(state: AvatarsState, sessionId: string | null): AvatarsState {
  return {
    ...state,
    sessionId,
    requestId: null,
    uploadedFile: null,
    uploadKey: null,
    progress: null,
    phase: Phase.Idle,
    saveRequest: idleRequest(),
  };
}
function accepts(state: AvatarsState, sessionId: string, requestId: string): boolean {
  return (
    state.sessionId === sessionId &&
    state.requestId === requestId &&
    isRequestPending(state.saveRequest)
  );
}
export const avatarSaveReducer = [
  on(editor.opened, (state: AvatarsState, { sessionId }) => reset(state, sessionId)),
  on(editor.closed, (state: AvatarsState, { sessionId }) =>
    state.sessionId === sessionId ? reset(state, null) : state,
  ),
  on(save.requested, (state: AvatarsState, { sessionId, requestId }): AvatarsState =>
    state.sessionId !== sessionId || isRequestPending(state.saveRequest)
      ? state
      : { ...state, requestId, saveRequest: pendingRequest(), phase: Phase.Upload, progress: 0 },
  ),
  on(editor.progress, (state: AvatarsState, { sessionId, requestId, progress }): AvatarsState =>
    accepts(state, sessionId, requestId) ? { ...state, progress, phase: Phase.Upload } : state,
  ),
  on(
    editor.uploaded,
    (state: AvatarsState, { sessionId, requestId, fileKey, key }): AvatarsState =>
      accepts(state, sessionId, requestId)
        ? { ...state, uploadedFile: fileKey, uploadKey: key, progress: 100, phase: Phase.Confirm }
        : state,
  ),
  on(save.succeeded, (state: AvatarsState, { sessionId, requestId, avatar }): AvatarsState =>
    accepts(state, sessionId, requestId)
      ? {
          ...state,
          saveRequest: succeededRequest(),
          phase: Phase.Idle,
          avatars: [avatar, ...state.avatars.filter((item) => item.id !== avatar.id)],
        }
      : state,
  ),
  on(save.failed, (state: AvatarsState, { sessionId, requestId, error }): AvatarsState =>
    accepts(state, sessionId, requestId)
      ? {
          ...state,
          saveRequest: failedRequest(error),
          uploadKey:
            error.code === RequestErrorCode.Conflict || error.code === RequestErrorCode.BadRequest
              ? null
              : state.uploadKey,
          uploadedFile:
            error.code === RequestErrorCode.Conflict || error.code === RequestErrorCode.BadRequest
              ? null
              : state.uploadedFile,
        }
      : state,
  ),
];
