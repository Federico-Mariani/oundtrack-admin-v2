import { on } from '@ngrx/store';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import type { TvSeriesState } from '../tv-series.state';
import {
  TvSeriesAudioEvents as events,
  TvSeriesAudioSaveActions as save,
} from '../actions/tv-series-audio.actions';
import { initialTvSeriesAudioState } from '../tv-series-audio.state';
import { TvSeriesAudioPhase } from '../../../domain/models/tv-series-audio-phase.model';

export const tvSeriesAudioReducer = [
  on(events.restartUpload, (state: TvSeriesState, { sessionId }): TvSeriesState =>
    state.audio.sessionId !== sessionId || isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: { ...state.audio, uploaded: false, progress: 0 },
          audioRequest: idleRequest(),
        },
  ),
  on(save.reset, (state: TvSeriesState): TvSeriesState => ({
    ...state,
    audio: initialTvSeriesAudioState,
    audioRequest: idleRequest(),
  })),
  on(events.opened, (state: TvSeriesState, { sessionId, track, soundtrackId }): TvSeriesState => ({
    ...state,
    audio: { ...initialTvSeriesAudioState, sessionId, track, soundtrackId },
    audioRequest: idleRequest(),
  })),
  on(events.closed, (state: TvSeriesState, { sessionId }): TvSeriesState =>
    state.audio.sessionId !== sessionId
      ? state
      : { ...state, audio: initialTvSeriesAudioState, audioRequest: idleRequest() },
  ),
  on(events.cancelled, (state: TvSeriesState, { sessionId }): TvSeriesState =>
    state.audio.sessionId !== sessionId ? state : { ...state, audioRequest: idleRequest() },
  ),
  on(save.requested, (state: TvSeriesState, { sessionId }): TvSeriesState =>
    state.audio.sessionId !== sessionId ||
    isRequestPending(state.audioRequest) ||
    state.audio.creationUncertain
      ? state
      : { ...state, audioRequest: pendingRequest() },
  ),
  on(events.phase, (state: TvSeriesState, { sessionId, phase }): TvSeriesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: {
            ...state.audio,
            phase,
            progress: phase === TvSeriesAudioPhase.Uploading ? 0 : state.audio.progress,
          },
        },
  ),
  on(events.created, (state: TvSeriesState, { sessionId, track, soundtrackId }): TvSeriesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, track, soundtrackId } },
  ),
  on(events.progress, (state: TvSeriesState, { sessionId, progress }): TvSeriesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, progress } },
  ),
  on(events.uploaded, (state: TvSeriesState, { sessionId }): TvSeriesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, uploaded: true, progress: 100 } },
  ),
  on(save.succeeded, (state: TvSeriesState, { sessionId, track }): TvSeriesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: { ...state.audio, track, phase: TvSeriesAudioPhase.Done },
          audioRequest: succeededRequest(),
        },
  ),
  on(save.failed, (state: TvSeriesState, { sessionId, error }): TvSeriesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: {
            ...state.audio,
            creationUncertain:
              state.audio.phase === TvSeriesAudioPhase.Creating &&
              (!error.status || error.status >= 500),
          },
          audioRequest: failedRequest(error),
        },
  ),
];
