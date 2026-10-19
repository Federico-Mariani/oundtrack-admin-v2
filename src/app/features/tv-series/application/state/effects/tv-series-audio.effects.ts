import { type RequestError, RequestErrorCode } from '@shared/state/request/request-error';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { type Action, Store } from '@ngrx/store';
import {
  catchError,
  concat,
  concatMap,
  defer,
  exhaustMap,
  filter,
  map,
  merge,
  type Observable,
  of,
  takeUntil,
  throwError,
} from 'rxjs';
import {
  TvSeriesAudioEvents as events,
  TvSeriesAudioSaveActions as save,
} from '../actions/tv-series-audio.actions';
import type { TvSeriesSoundtracksRepositoryPort } from '../../ports/tv-series-soundtracks-repository.port';
import type { TvSeriesAudioInputModel } from '../../../domain/models/tv-series-audio-input.model';
import type { TvSeriesAudioState } from '../tv-series-audio.state';
import { TvSeriesAudioMode } from '@app/features/tv-series/domain/models/tv-series-audio-mode.model';
import { TV_SERIES_SOUNDTRACKS_REPOSITORY } from '../../tokens/tv-series-soundtracks-repository.token';
import { TvSeriesAudioPhase } from '../../../domain/models/tv-series-audio-phase.model';
import { tvSeriesFeature } from '../tv-series.feature';

function workflow(
  repository: TvSeriesSoundtracksRepositoryPort,
  state: TvSeriesAudioState,
  sessionId: string,
  input: TvSeriesAudioInputModel,
): Observable<Action> {
  const phase = (value: TvSeriesAudioPhase): Observable<Action> =>
    of(events.phase({ sessionId, phase: value }));
  if (input.mode === TvSeriesAudioMode.Languages && state.track) {
    return concat(
      phase(TvSeriesAudioPhase.Languages),
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
      : repository.create(input.tvSeriesId, input.externalId, input.languages).pipe(
          concatMap((soundtrack) => {
            const track = soundtrack.tracks.at(0);
            return track
              ? of({ track, soundtrackId: soundtrack.id })
              : throwError(() => ({ code: RequestErrorCode.Unknown }));
          }),
        );
  return concat(
    ...(existing ? [] : [phase(TvSeriesAudioPhase.Creating)]),
    creation.pipe(
      concatMap(({ track, soundtrackId }) =>
        concat(
          of(events.created({ sessionId, track, soundtrackId })),
          ...(state.uploaded
            ? []
            : [
                phase(TvSeriesAudioPhase.Uploading),
                defer(() =>
                  input.fileKey
                    ? repository.upload(track.id, input.fileKey)
                    : throwError(() => ({ code: RequestErrorCode.Validation })),
                ).pipe(map((progress) => events.progress({ sessionId, progress }))),
                of(events.uploaded({ sessionId })),
              ]),
          phase(TvSeriesAudioPhase.Confirming),
          defer(() => repository.complete(track.id)).pipe(
            map((updated) => save.succeeded({ sessionId, track: updated })),
          ),
        ),
      ),
    ),
  );
}

export const saveTvSeriesAudio = createEffect(
  (
    actions$ = inject(Actions),
    repository = inject(TV_SERIES_SOUNDTRACKS_REPOSITORY),
    store = inject(Store),
  ) => {
    const audio = store.selectSignal(tvSeriesFeature.selectAudio);

    return actions$.pipe(
      ofType(save.requested),
      filter(({ sessionId }) => audio().sessionId === sessionId && !audio().creationUncertain),
      exhaustMap(({ sessionId, input }) =>
        workflow(repository, audio(), sessionId, input).pipe(
          catchError((error: RequestError) => of(save.failed({ sessionId, error }))),
          takeUntil(
            merge(
              actions$.pipe(
                ofType(events.closed, events.cancelled),
                filter((event) => event.sessionId === sessionId),
              ),
              actions$.pipe(ofType(events.opened, save.reset)),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
