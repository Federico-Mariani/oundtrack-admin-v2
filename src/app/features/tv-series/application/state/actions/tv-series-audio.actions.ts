import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { TvSeriesAudioInputModel } from '../../../domain/models/tv-series-audio-input.model';
import type { TvSeriesSoundtrackTrackModel } from '../../../domain/models/tv-series-soundtrack-track.model';
import { TV_SERIES_STATE_DEFINITION } from '../tv-series-state-definition';
import { TvSeriesRequestOperation } from '../tv-series-request-operation';
import type { TvSeriesAudioPhase } from '../../../domain/models/tv-series-audio-phase.model';

export const TvSeriesAudioSaveActions = createRequestActions<
  { readonly sessionId: string; readonly input: TvSeriesAudioInputModel },
  { readonly sessionId: string; readonly track: TvSeriesSoundtrackTrackModel },
  { readonly sessionId: string; readonly error: RequestError }
>(TV_SERIES_STATE_DEFINITION.source, TvSeriesRequestOperation.AudioSave);

export const TvSeriesAudioEvents = createActionGroup({
  source: `${TV_SERIES_STATE_DEFINITION.source} ${TvSeriesRequestOperation.AudioEditor}` as const,
  events: {
    Opened: props<{
      sessionId: string;
      track: TvSeriesSoundtrackTrackModel | null;
      soundtrackId: string | null;
    }>(),
    Closed: props<{ sessionId: string }>(),
    RestartUpload: props<{ sessionId: string }>(),
    Cancelled: props<{ sessionId: string }>(),
    Phase: props<{ sessionId: string; phase: TvSeriesAudioPhase }>(),
    Created: props<{
      sessionId: string;
      track: TvSeriesSoundtrackTrackModel;
      soundtrackId: string;
    }>(),
    Progress: props<{ sessionId: string; progress: number }>(),
    Uploaded: props<{ sessionId: string }>(),
  },
});
