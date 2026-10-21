import type { RequestError } from '@shared/state/request/request-error';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, merge, of, takeUntil } from 'rxjs';
import {
  SoundtracksAudioEvents as events,
  SoundtracksAudioSaveActions as save,
} from '../actions/soundtracks-audio.actions';
import { SOUNDTRACKS_REPOSITORY } from '../../tokens/soundtracks-repository.token';
import { soundtracksFeature } from '../soundtracks.feature';
import { saveSoundtrackWorkflow } from '../workflows/save-soundtrack.workflow';
export const saveSoundtracksAudio = createEffect(
  (
    actions$ = inject(Actions),
    repository = inject(SOUNDTRACKS_REPOSITORY),
    store = inject(Store),
  ) => {
    const audio = store.selectSignal(soundtracksFeature.selectAudio);

    return actions$.pipe(
      ofType(save.requested),
      filter(({ sessionId }) => audio().sessionId === sessionId && !audio().creationUncertain),
      exhaustMap(({ sessionId, input }) =>
        saveSoundtrackWorkflow(repository, audio(), sessionId, input).pipe(
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
