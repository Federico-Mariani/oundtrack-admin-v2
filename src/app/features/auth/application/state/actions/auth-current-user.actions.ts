import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthCurrentUserActions = createActionGroup({
  source: 'AUTH - Current User',

  events: {
    'Current User Load Requested': emptyProps(),
  },
});
