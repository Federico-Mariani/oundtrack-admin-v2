import { createActionGroup, props } from '@ngrx/store';
import type { RequestError } from '@shared/state/request/request-error';
import type { AuthSession } from '../../../../domain/models/auth-session';

export const AuthLoginApiActions = createActionGroup({
  source: 'AUTH (API) - Sign In',
  events: {
    'Login Succeeded': props<{
      session: AuthSession;
    }>(),

    'Login Failed': props<{
      error: RequestError;
    }>(),
  },
});
