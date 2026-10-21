import { on } from '@ngrx/store';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import type { SoundtracksState } from '../soundtracks.state';
import {
  SoundtracksAudioEvents as events,
  SoundtracksAudioSaveActions as save,
} from '../actions/soundtracks-audio.actions';
import { initialSoundtracksAudioState } from '../soundtracks-audio.state';
import { SoundtrackEditorPhase } from '../../workflows/soundtrack-editor.phase';

export const soundtracksAudioReducer = [
  on(events.restartUpload, (state: SoundtracksState, { sessionId }): SoundtracksState =>
    state.audio.sessionId !== sessionId || isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: { ...state.audio, uploaded: false, progress: 0 },
          audioRequest: idleRequest(),
        },
  ),
  on(save.reset, (state: SoundtracksState): SoundtracksState => ({
    ...state,
    audio: initialSoundtracksAudioState,
    audioRequest: idleRequest(),
  })),
  on(
    events.opened,
    (state: SoundtracksState, { sessionId, track, soundtrackId }): SoundtracksState => ({
      ...state,
      audio: { ...initialSoundtracksAudioState, sessionId, track, soundtrackId },
      audioRequest: idleRequest(),
    }),
  ),
  on(events.closed, (state: SoundtracksState, { sessionId }): SoundtracksState =>
    state.audio.sessionId !== sessionId
      ? state
      : { ...state, audio: initialSoundtracksAudioState, audioRequest: idleRequest() },
  ),
  on(events.cancelled, (state: SoundtracksState, { sessionId }): SoundtracksState =>
    state.audio.sessionId !== sessionId ? state : { ...state, audioRequest: idleRequest() },
  ),
  on(save.requested, (state: SoundtracksState, { sessionId }): SoundtracksState =>
    state.audio.sessionId !== sessionId ||
    isRequestPending(state.audioRequest) ||
    state.audio.creationUncertain
      ? state
      : { ...state, audioRequest: pendingRequest() },
  ),
  on(events.phase, (state: SoundtracksState, { sessionId, phase }): SoundtracksState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: {
            ...state.audio,
            phase,
            progress: phase === SoundtrackEditorPhase.Uploading ? 0 : state.audio.progress,
          },
        },
  ),
  on(
    events.created,
    (state: SoundtracksState, { sessionId, track, soundtrackId }): SoundtracksState =>
      state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
        ? state
        : { ...state, audio: { ...state.audio, track, soundtrackId } },
  ),
  on(events.progress, (state: SoundtracksState, { sessionId, progress }): SoundtracksState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, progress } },
  ),
  on(events.uploaded, (state: SoundtracksState, { sessionId }): SoundtracksState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, uploaded: true, progress: 100 } },
  ),
  on(save.succeeded, (state: SoundtracksState, { sessionId, track }): SoundtracksState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: { ...state.audio, track, phase: SoundtrackEditorPhase.Done },
          audioRequest: succeededRequest(),
        },
  ),
  on(save.failed, (state: SoundtracksState, { sessionId, error }): SoundtracksState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: {
            ...state.audio,
            creationUncertain:
              state.audio.phase === SoundtrackEditorPhase.Creating &&
              (!error.status || error.status >= 500),
          },
          audioRequest: failedRequest(error),
        },
  ),
];
