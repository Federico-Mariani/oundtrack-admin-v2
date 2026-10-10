import { createActionGroup, props } from '@ngrx/store';
import type { RequestError } from '@shared/state/request/request-error';
import type { User } from '../../../../domain/models/user';

export const AuthCurrentUserApiActions = createActionGroup({
  source: 'AUTH (API) - Current User',

  events: {
    'Current User Loaded': props<{
      readonly user: User;
    }>(),

    'Current User Load Failed': props<{
      readonly error: RequestError;
    }>(),
  },
});
