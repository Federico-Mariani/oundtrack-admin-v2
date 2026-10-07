import {createActionGroup, emptyProps, props} from '@ngrx/store';
import type {AuthSession} from '../../../domain/models/auth-session';

/** Session lifecycle intents (app bootstrap, server-side invalidation). */
export const AuthSessionActions = createActionGroup({
    source: 'AUTH - Session',
    events: {
        'Restore Requested': emptyProps(),
        /** The backend rejected the current session; it must be discarded. */
        Expired: emptyProps(),
    },
});

/** Outcomes reported by the session restore effect. */
export const AuthSessionStorageActions = createActionGroup({
    source: 'AUTH - Session Storage',
    events: {
        'Restore Succeeded': props<{ readonly session: AuthSession }>(),
        /** Nothing usable was persisted (absent or expired session). */
        'No Session Found': emptyProps(),
    },
});
