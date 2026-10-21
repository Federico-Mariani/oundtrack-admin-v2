import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { SaveSoundtrackCommand } from '../../commands/save-soundtrack.command';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';
import { SOUNDTRACKS_STATE_DEFINITION } from '../soundtracks-state-definition';
import { SoundtracksRequestOperation } from '../soundtracks-request-operation';
import type { SoundtrackEditorPhase } from '../../workflows/soundtrack-editor.phase';

export const SoundtracksAudioSaveActions = createRequestActions<
  { readonly sessionId: string; readonly input: SaveSoundtrackCommand },
  { readonly sessionId: string; readonly track: SoundtrackTrackModel },
  { readonly sessionId: string; readonly error: RequestError }
>(SOUNDTRACKS_STATE_DEFINITION.source, SoundtracksRequestOperation.AudioSave);

export const SoundtracksAudioEvents = createActionGroup({
  source:
    `${SOUNDTRACKS_STATE_DEFINITION.source} ${SoundtracksRequestOperation.AudioEditor}` as const,
  events: {
    Opened: props<{
      sessionId: string;
      track: SoundtrackTrackModel | null;
      soundtrackId: string | null;
    }>(),
    Closed: props<{ sessionId: string }>(),
    RestartUpload: props<{ sessionId: string }>(),
    Cancelled: props<{ sessionId: string }>(),
    Phase: props<{ sessionId: string; phase: SoundtrackEditorPhase }>(),
    Created: props<{
      sessionId: string;
      track: SoundtrackTrackModel;
      soundtrackId: string;
    }>(),
    Progress: props<{ sessionId: string; progress: number }>(),
    Uploaded: props<{ sessionId: string }>(),
  },
});
