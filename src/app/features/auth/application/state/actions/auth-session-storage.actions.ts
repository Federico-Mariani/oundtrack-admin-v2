import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { AuthSession } from '../../../domain/models/auth-session';

export const AuthSessionStorageActions = createActionGroup({
  source: 'AUTH (Storage) - Session',

  events: {
    'Session Restored': props<{
      readonly session: AuthSession;
    }>(),

    'Session Not Found': emptyProps(),
  },
});
