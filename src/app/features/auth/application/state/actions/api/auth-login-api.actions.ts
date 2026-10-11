import { createActionGroup, props } from '@ngrx/store';
import type { RequestError } from '@shared/state/request/request-error';
import type { AuthSessionModel } from '../../../../domain/models/auth-session.model';

export const AuthLoginApiActions = createActionGroup({
  source: 'AUTH (API) - Sign In',
  events: {
    'Login Succeeded': props<{
      session: AuthSessionModel;
    }>(),

    'Login Failed': props<{
      error: RequestError;
    }>(),
  },
});
