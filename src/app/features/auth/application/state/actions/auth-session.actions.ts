import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthSessionActions = createActionGroup({
  source: 'AUTH - Session',

  events: {
    'Session Restore Requested': emptyProps(),
    'Session Expired': emptyProps(),
  },
});
