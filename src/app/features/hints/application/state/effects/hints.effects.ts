import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap, takeUntil } from 'rxjs';
import type { RequestError } from '@shared/state/request/request-error';
import { HINTS_REPOSITORY } from '../../tokens/hints-repository.token';
import { hintsFeature } from '../hints.feature';
import {
  HintsPanelEvents as panel,
  HintsLoadActions as load,
  HintsSaveActions as save,
} from '../actions/hints.actions';
export const loadHints = createEffect(
  (actions$ = inject(Actions), repository = inject(HINTS_REPOSITORY), store = inject(Store)) => {
    const state = store.selectSignal(hintsFeature.selectHintsState);
    return actions$.pipe(
      ofType(load.requested),
      filter(
        ({ sessionId, requestId }) =>
          state().sessionId === sessionId && state().loadId === requestId,
      ),
      switchMap(({ sessionId, requestId, ownerId }) =>
        repository.getByOwner(ownerId).pipe(
          map((hints) => load.succeeded({ sessionId, requestId, hints })),
          catchError((error: RequestError) => of(load.failed({ sessionId, requestId, error }))),
          takeUntil(
            actions$.pipe(
              ofType(panel.opened, panel.closed, save.requested),
              filter(() => state().sessionId !== sessionId || state().loadId !== requestId),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
export const saveHint = createEffect(
  (actions$ = inject(Actions), repository = inject(HINTS_REPOSITORY), store = inject(Store)) => {
    const state = store.selectSignal(hintsFeature.selectHintsState);
    return actions$.pipe(
      ofType(save.requested),
      filter(
        ({ sessionId, requestId }) =>
          state().sessionId === sessionId && state().saveId === requestId,
      ),
      exhaustMap(({ sessionId, requestId, command }) =>
        repository.save(command).pipe(
          map((hint) => save.succeeded({ sessionId, requestId, hint })),
          catchError((error: RequestError) => of(save.failed({ sessionId, requestId, error }))),
          takeUntil(
            actions$.pipe(
              ofType(panel.opened, panel.closed, save.reset),
              filter(() => state().sessionId !== sessionId || state().saveId !== requestId),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
