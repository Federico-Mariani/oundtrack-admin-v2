import { createActionGroup, props } from '@ngrx/store';
import type { RequestError } from '@shared/state/request/request-error';
import type { UserModel } from '../../../../domain/models/user.model';

export const AuthCurrentUserApiActions = createActionGroup({
  source: 'AUTH (API) - Current User',

  events: {
    'Current User Loaded': props<{
      readonly user: UserModel;
    }>(),

    'Current User Load Failed': props<{
      readonly error: RequestError;
    }>(),
  },
});
