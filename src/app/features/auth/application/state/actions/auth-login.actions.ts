import {createActionGroup, props} from '@ngrx/store';
import type {AuthError, LoginCredentials} from '@features/auth';
import type {AuthSession} from '../../../domain/models/auth-session';

/** Intents coming from the UI. */
export const AuthLoginActions = createActionGroup({
    source: 'AUTH - Login',
    events: {
        Requested: props<{ readonly credentials: LoginCredentials }>(),
    },
});

/** Outcomes reported by the login effect. */
export const AuthLoginApiActions = createActionGroup({
    source: 'AUTH - Login API',
    events: {
        Succeeded: props<{ readonly session: AuthSession }>(),
        Failed: props<{ readonly error: AuthError }>(),
    },
});
