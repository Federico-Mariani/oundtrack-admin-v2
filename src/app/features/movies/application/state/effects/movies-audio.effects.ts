import { RequestErrorCode, type RequestError } from '@shared/state/request/request-error';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, type Action } from '@ngrx/store';
import {
  catchError,
  concat,
  concatMap,
  defer,
  exhaustMap,
  filter,
  map,
  merge,
  of,
  takeUntil,
  throwError,
  type Observable,
} from 'rxjs';
import { MOVIE_SOUNDTRACKS_REPOSITORY } from '../../tokens/movie-soundtracks-repository.token';
import type { MovieSoundtracksRepositoryPort } from '../../ports/movie-soundtracks-repository.port';
import type { MovieAudioInputModel } from '../../../domain/models/movie-audio-input.model';
import { MovieAudioMode } from '../../../domain/models/movie-audio-mode.model';
import { MovieAudioPhase } from '../../../domain/models/movie-audio-phase.model';
import { moviesFeature } from '../movies.feature';
import type { MoviesAudioState } from '../movies-audio.state';
import {
  MoviesAudioEvents as events,
  MoviesAudioSaveActions as save,
} from '../actions/movies-audio.actions';

function workflow(
  repository: MovieSoundtracksRepositoryPort,
  state: MoviesAudioState,
  sessionId: string,
  input: MovieAudioInputModel,
): Observable<Action> {
  const phase = (value: MovieAudioPhase): Observable<Action> =>
    of(events.phase({ sessionId, phase: value }));
  if (input.mode === MovieAudioMode.Languages && state.track) {
    return concat(
      phase(MovieAudioPhase.Languages),
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
      : repository.create(input.movieId, input.externalId, input.languages).pipe(
          concatMap((soundtrack) => {
            const track = soundtrack.tracks.at(0);
            return track
              ? of({ track, soundtrackId: soundtrack.id })
              : throwError(() => ({ code: RequestErrorCode.Unknown }));
          }),
        );
  return concat(
    ...(existing ? [] : [phase(MovieAudioPhase.Creating)]),
    creation.pipe(
      concatMap(({ track, soundtrackId }) =>
        concat(
          of(events.created({ sessionId, track, soundtrackId })),
          ...(state.uploaded
            ? []
            : [
                phase(MovieAudioPhase.Uploading),
                defer(() =>
                  input.fileKey
                    ? repository.upload(track.id, input.fileKey)
                    : throwError(() => ({ code: RequestErrorCode.Validation })),
                ).pipe(map((progress) => events.progress({ sessionId, progress }))),
                of(events.uploaded({ sessionId })),
              ]),
          phase(MovieAudioPhase.Confirming),
          defer(() => repository.complete(track.id)).pipe(
            map((updated) => save.succeeded({ sessionId, track: updated })),
          ),
        ),
      ),
    ),
  );
}
export const saveMovieAudio = createEffect(
  (
    actions$ = inject(Actions),
    repository = inject(MOVIE_SOUNDTRACKS_REPOSITORY),
    store = inject(Store),
  ) => {
    const audio = store.selectSignal(moviesFeature.selectAudio);
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
