import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { AuthSessionModel } from '../../../domain/models/auth-session.model';

export const AuthSessionStorageActions = createActionGroup({
  source: 'Auth Session Storage',

  events: {
    'Session Restored': props<{
      readonly session: AuthSessionModel;
    }>(),

    'Session Not Found': emptyProps(),
  },
});
