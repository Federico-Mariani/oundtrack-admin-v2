import { saveHintWorkflow } from '../workflows/save-hint.workflow';
import { HintSaveEventKind } from '../workflows/hint-save-event.workflow';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap, takeUntil } from 'rxjs';
import type { RequestError } from '@shared/state/request/request-error';
import { HINTS_REPOSITORY } from '../../tokens/hints-repository.token';
import { hintsFeature } from '../hints.feature';
import {
  HintsIconsActions as icons,
  HintsSaveProgressEvents,
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
        saveHintWorkflow(repository, command, state()).pipe(
          map((event) =>
            event.kind === HintSaveEventKind.Completed
              ? save.succeeded({ sessionId, requestId, hint: event.hint })
              : HintsSaveProgressEvents.changed({ sessionId, requestId, event }),
          ),
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

export const loadHintIcons = createEffect(
  (actions$ = inject(Actions), repository = inject(HINTS_REPOSITORY), store = inject(Store)) => {
    const state = store.selectSignal(hintsFeature.selectHintsState);
    return actions$.pipe(
      ofType(icons.requested),
      filter(
        ({ sessionId, requestId }) =>
          state().sessionId === sessionId && state().iconsId === requestId,
      ),
      switchMap(({ sessionId, requestId }) =>
        repository.getIcons().pipe(
          map((result) => icons.succeeded({ sessionId, requestId, icons: result })),
          catchError((error: RequestError) => of(icons.failed({ sessionId, requestId, error }))),
          takeUntil(
            actions$.pipe(
              ofType(panel.opened, panel.closed),
              filter(() => state().sessionId !== sessionId),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
