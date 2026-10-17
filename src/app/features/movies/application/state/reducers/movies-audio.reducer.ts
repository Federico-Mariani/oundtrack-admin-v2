import { on } from '@ngrx/store';
import {
  idleRequest,
  pendingRequest,
  failedRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { isRequestPending } from '@shared/state/request/request-state.queries';
import { MovieAudioPhase } from '../../../domain/models/movie-audio-phase.model';
import type { MoviesState } from '../movies.state';
import { initialMoviesAudioState } from '../movies-audio.state';
import {
  MoviesAudioEvents as events,
  MoviesAudioSaveActions as save,
} from '../actions/movies-audio.actions';
export const moviesAudioReducer = [
  on(events.restartUpload, (state: MoviesState, { sessionId }): MoviesState =>
    state.audio.sessionId !== sessionId || isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: { ...state.audio, uploaded: false, progress: 0 },
          audioRequest: idleRequest(),
        },
  ),
  on(save.reset, (state: MoviesState): MoviesState => ({
    ...state,
    audio: initialMoviesAudioState,
    audioRequest: idleRequest(),
  })),
  on(events.opened, (state: MoviesState, { sessionId, track, soundtrackId }): MoviesState => ({
    ...state,
    audio: { ...initialMoviesAudioState, sessionId, track, soundtrackId },
    audioRequest: idleRequest(),
  })),
  on(events.closed, (state: MoviesState, { sessionId }): MoviesState =>
    state.audio.sessionId !== sessionId
      ? state
      : { ...state, audio: initialMoviesAudioState, audioRequest: idleRequest() },
  ),
  on(events.cancelled, (state: MoviesState, { sessionId }): MoviesState =>
    state.audio.sessionId !== sessionId ? state : { ...state, audioRequest: idleRequest() },
  ),
  on(save.requested, (state: MoviesState, { sessionId }): MoviesState =>
    state.audio.sessionId !== sessionId ||
    isRequestPending(state.audioRequest) ||
    state.audio.creationUncertain
      ? state
      : { ...state, audioRequest: pendingRequest() },
  ),
  on(events.phase, (state: MoviesState, { sessionId, phase }): MoviesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: {
            ...state.audio,
            phase,
            progress: phase === MovieAudioPhase.Uploading ? 0 : state.audio.progress,
          },
        },
  ),
  on(events.created, (state: MoviesState, { sessionId, track, soundtrackId }): MoviesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, track, soundtrackId } },
  ),
  on(events.progress, (state: MoviesState, { sessionId, progress }): MoviesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, progress } },
  ),
  on(events.uploaded, (state: MoviesState, { sessionId }): MoviesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : { ...state, audio: { ...state.audio, uploaded: true, progress: 100 } },
  ),
  on(save.succeeded, (state: MoviesState, { sessionId, track }): MoviesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: { ...state.audio, track, phase: MovieAudioPhase.Done },
          audioRequest: succeededRequest(),
        },
  ),
  on(save.failed, (state: MoviesState, { sessionId, error }): MoviesState =>
    state.audio.sessionId !== sessionId || !isRequestPending(state.audioRequest)
      ? state
      : {
          ...state,
          audio: {
            ...state.audio,
            creationUncertain:
              state.audio.phase === MovieAudioPhase.Creating &&
              (!error.status || error.status >= 500),
          },
          audioRequest: failedRequest(error),
        },
  ),
];
