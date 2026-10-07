import {createActionGroup, emptyProps, props} from '@ngrx/store';
import type {AuthError, User} from '@features/auth';

/** Current-user intents: triggered after a session is established or on demand. */
export const AuthUserActions = createActionGroup({
    source: 'AUTH - User',
    events: {
        'Load Requested': emptyProps(),
    },
});

/** Outcomes reported by the current-user effect. */
export const AuthUserApiActions = createActionGroup({
    source: 'AUTH - User API',
    events: {
        'Load Succeeded': props<{ readonly user: User }>(),
        'Load Failed': props<{ readonly error: AuthError }>(),
    },
});
