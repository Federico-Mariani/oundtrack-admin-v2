/**
 * Translation keys for the Login UI, relative to the `auth` Transloco scope
 * (the login form reads that scope). Centralizing them here means each key is
 * written once: if the JSON structure changes, only this file changes instead
 * of every template usage, and consumers get type-safe, autocompleted keys.
 *
 * Keys are relative to the scope, e.g. `login.title` resolves to `auth.login.title`.
 */
export const AUTH_LOGIN_TRANSLATION_KEYS = {
  title: 'login.title',
  description: 'login.description',
  actions: {
    submit: 'login.actions.submit',
    reset: 'login.actions.reset',
  },
  signUp: {
    prompt: 'login.signUp.prompt',
    link: 'login.signUp.link',
  },
} as const;
