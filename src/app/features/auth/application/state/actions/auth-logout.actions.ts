import {createActionGroup, emptyProps} from '@ngrx/store';

/** Logout is local (no backend call): a single intent terminates the session. */
export const AuthLogoutActions = createActionGroup({
    source: 'AUTH - Logout',
    events: {
        Requested: emptyProps(),
    },
});
