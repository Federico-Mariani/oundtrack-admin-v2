import { createActionGroup, props } from '@ngrx/store';
import type { AuthError } from '../../../domain/errors/auth-error';
import type { AuthSession } from '../../../domain/models/auth-session';
import type { LoginCredentials } from '../../../domain/models/login-credentials';

/** Intents coming from the UI. */
export const AuthLoginActions = createActionGroup({
  source: 'Auth Login',
  events: {
    Requested: props<{ readonly credentials: LoginCredentials }>(),
  },
});

/** Outcomes reported by the login effect. */
export const AuthLoginApiActions = createActionGroup({
  source: 'Auth Login API',
  events: {
    Succeeded: props<{ readonly session: AuthSession }>(),
    Failed: props<{ readonly error: AuthError }>(),
  },
});
