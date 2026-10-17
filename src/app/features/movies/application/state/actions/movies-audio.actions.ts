import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { MovieSoundtrackTrackModel } from '../../../domain/models/movie-soundtrack-track.model';
import type { MovieAudioInputModel } from '../../../domain/models/movie-audio-input.model';
import type { MovieAudioPhase } from '../../../domain/models/movie-audio-phase.model';
import { MOVIES_STATE_DEFINITION } from '../movies-state-definition';
import { MoviesRequestOperation } from '../movies-request-operation';
export const MoviesAudioSaveActions = createRequestActions<
  { readonly sessionId: string; readonly input: MovieAudioInputModel },
  { readonly sessionId: string; readonly track: MovieSoundtrackTrackModel },
  { readonly sessionId: string; readonly error: RequestError }
>(MOVIES_STATE_DEFINITION.source, MoviesRequestOperation.AudioSave);
export const MoviesAudioEvents = createActionGroup({
  source: `${MOVIES_STATE_DEFINITION.source} ${MoviesRequestOperation.AudioEditor}` as const,
  events: {
    Opened: props<{
      sessionId: string;
      track: MovieSoundtrackTrackModel | null;
      soundtrackId: string | null;
    }>(),
    Closed: props<{ sessionId: string }>(),
    RestartUpload: props<{ sessionId: string }>(),
    Cancelled: props<{ sessionId: string }>(),
    Phase: props<{ sessionId: string; phase: MovieAudioPhase }>(),
    Created: props<{ sessionId: string; track: MovieSoundtrackTrackModel; soundtrackId: string }>(),
    Progress: props<{ sessionId: string; progress: number }>(),
    Uploaded: props<{ sessionId: string }>(),
  },
});
