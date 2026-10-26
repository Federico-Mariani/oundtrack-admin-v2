import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, takeUntil } from 'rxjs';
import { resolveRequest } from '@shared/state/request-rxjs';
import { AVATARS_REPOSITORY } from '../../tokens/avatars-repository.token';
import { AvatarsLoadActions as load } from '../actions/avatars-load.actions';
import { AvatarSaveActions as save } from '../actions/avatar-save.actions';
export const loadAvatars = createEffect(
  (actions$ = inject(Actions), repository = inject(AVATARS_REPOSITORY)) =>
    actions$.pipe(
      ofType(load.requested),
      switchMap(() =>
        resolveRequest(
          repository.getAll(),
          (avatars) => load.succeeded({ avatars }),
          (error) => load.failed({ error }),
        ).pipe(takeUntil(actions$.pipe(ofType(save.succeeded, load.reset)))),
      ),
    ),
  { functional: true },
);
