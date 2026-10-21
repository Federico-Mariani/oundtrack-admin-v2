import { RequestErrorCode } from '@shared/state/request/request-error';
import type { Action } from '@ngrx/store';
import { concat, concatMap, defer, map, of, throwError, type Observable } from 'rxjs';
import type { SoundtracksRepositoryPort } from '../../ports/soundtracks-repository.port';
import type { SaveSoundtrackCommand } from '../../commands/save-soundtrack.command';
import type { SoundtracksAudioState } from '../soundtracks-audio.state';
import { SoundtrackEditorMode } from '../../workflows/soundtrack-editor.mode';
import { SoundtrackEditorPhase } from '../../workflows/soundtrack-editor.phase';
import {
  SoundtracksAudioEvents as events,
  SoundtracksAudioSaveActions as save,
} from '../actions/soundtracks-audio.actions';
export function saveSoundtrackWorkflow(
  repository: SoundtracksRepositoryPort,
  state: SoundtracksAudioState,
  sessionId: string,
  input: SaveSoundtrackCommand,
): Observable<Action> {
  const phase = (value: SoundtrackEditorPhase): Observable<Action> =>
    of(events.phase({ sessionId, phase: value }));
  if (input.mode === SoundtrackEditorMode.Languages && state.track) {
    return concat(
      phase(SoundtrackEditorPhase.Languages),
      repository
        .languages(state.track.id, input.languages)
        .pipe(map((track) => save.succeeded({ sessionId, track }))),
    );
  }
  const existing = state.track;
  const creation = existing
    ? of({ track: existing, soundtrackId: state.soundtrackId ?? '' })
    : input.soundtrackId
      ? repository
          .addTrack(input.soundtrackId, input.externalId, input.languages)
          .pipe(map((track) => ({ track, soundtrackId: input.soundtrackId ?? '' })))
      : repository.create(input.owner, input.externalId, input.languages).pipe(
          concatMap((soundtrack) => {
            const track = soundtrack.tracks.at(0);
            return track
              ? of({ track, soundtrackId: soundtrack.id })
              : throwError(() => ({ code: RequestErrorCode.Unknown }));
          }),
        );
  return concat(
    ...(existing ? [] : [phase(SoundtrackEditorPhase.Creating)]),
    creation.pipe(
      concatMap(({ track, soundtrackId }) =>
        concat(
          of(events.created({ sessionId, track, soundtrackId })),
          ...(state.uploaded
            ? []
            : [
                phase(SoundtrackEditorPhase.Uploading),
                defer(() =>
                  input.fileKey
                    ? repository.upload(track.id, input.fileKey)
                    : throwError(() => ({ code: RequestErrorCode.Validation })),
                ).pipe(map((progress) => events.progress({ sessionId, progress }))),
                of(events.uploaded({ sessionId })),
              ]),
          phase(SoundtrackEditorPhase.Confirming),
          defer(() => repository.complete(track.id)).pipe(
            map((updated) => save.succeeded({ sessionId, track: updated })),
          ),
        ),
      ),
    ),
  );
}
