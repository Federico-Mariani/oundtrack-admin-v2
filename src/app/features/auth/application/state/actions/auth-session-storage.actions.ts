import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { AuthSessionModel } from '../../../domain/models/auth-session.model';

export const AuthSessionStorageActions = createActionGroup({
  source: 'AUTH (Storage) - Session',

  events: {
    'Session Restored': props<{
      readonly session: AuthSessionModel;
    }>(),

    'Session Not Found': emptyProps(),
  },
});
