import { createActionGroup, props } from '@ngrx/store';
import type { AuthError } from '../../../domain/errors/auth-error';
import type { AuthSession } from '../../../domain/models/auth-session';
import type { RegistrationData } from '../../../domain/models/registration-data';

/** Intents coming from the UI. */
export const AuthRegistrationActions = createActionGroup({
  source: 'Auth Registration',
  events: {
    Requested: props<{ readonly data: RegistrationData }>(),
  },
});

/** Outcomes reported by the registration effect. */
export const AuthRegistrationApiActions = createActionGroup({
  source: 'Auth Registration API',
  events: {
    Succeeded: props<{ readonly session: AuthSession }>(),
    Failed: props<{ readonly error: AuthError }>(),
  },
});
