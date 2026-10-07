import {createActionGroup, props} from '@ngrx/store';
import type {AuthError, RegistrationData} from '@features/auth';
import type {AuthSession} from '../../../domain/models/auth-session';

/** Intents coming from the UI. */
export const AuthRegistrationActions = createActionGroup({
    source: 'AUTH - Registration',
    events: {
        Requested: props<{ readonly data: RegistrationData }>(),
    },
});

/** Outcomes reported by the registration effect. */
export const AuthRegistrationApiActions = createActionGroup({
    source: 'AUTH - Registration API',
    events: {
        Succeeded: props<{ readonly session: AuthSession }>(),
        Failed: props<{ readonly error: AuthError }>(),
    },
});
