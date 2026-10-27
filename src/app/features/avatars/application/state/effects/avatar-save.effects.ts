import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concat, concatMap, defer, exhaustMap, filter, map, of, takeUntil } from 'rxjs';
import type { RequestError } from '@shared/state/request/request-error';
import { AVATARS_REPOSITORY } from '../../tokens/avatars-repository.token';
import { avatarsFeature } from '../avatars.feature';
import {
  AvatarEditorEvents as editor,
  AvatarSaveActions as save,
} from '../actions/avatar-save.actions';
export const saveAvatar = createEffect(
  (actions$ = inject(Actions), repository = inject(AVATARS_REPOSITORY), store = inject(Store)) => {
    const state = store.selectSignal(avatarsFeature.selectAvatarsState);
    return actions$.pipe(
      ofType(save.requested),
      filter(
        (action) =>
          state().sessionId === action.sessionId && state().requestId === action.requestId,
      ),
      exhaustMap(({ sessionId, requestId, command }) =>
        defer(() => {
          const snapshot = state();
          return snapshot.uploadedFile === command.fileKey && snapshot.uploadKey
            ? of({ progress: 100, key: snapshot.uploadKey })
            : repository.upload(command.fileKey);
        }).pipe(
          concatMap((event) =>
            event.progress < 100
              ? of(editor.progress({ sessionId, requestId, progress: event.progress }))
              : concat(
                  of(
                    editor.uploaded({
                      sessionId,
                      requestId,
                      fileKey: command.fileKey,
                      key: event.key,
                    }),
                  ),
                  defer(() =>
                    repository.complete(command.fileKey, event.key, command.avatarId),
                  ).pipe(map((avatar) => save.succeeded({ sessionId, requestId, avatar }))),
                ),
          ),
          catchError((error: RequestError) => of(save.failed({ sessionId, requestId, error }))),
          takeUntil(
            actions$.pipe(
              ofType(editor.closed, editor.opened),
              filter(() => state().sessionId !== sessionId),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
