import { composeScopeLoader } from '@app/core/i18n/scope-translation-loader';

/** Transloco scope that owns the Auth feature translations (keys: `auth.*`). */
export const AUTH_I18N_SCOPE = 'auth';

/**
 * Declares, explicitly and statically, which JSON files compose the Auth scope
 * for each language. Each file becomes a namespace under the scope, producing
 * keys such as `auth.common.*` and `auth.login.*`. Files are imported lazily,
 * so Auth translations are only fetched when the Auth routes are entered.
 */
export const authTranslationsLoader = composeScopeLoader({
  en: {
    common: () => import('./en/common.json'),
    login: () => import('./en/login.json'),
  },
  it: {
    common: () => import('./it/common.json'),
    login: () => import('./it/login.json'),
  },
});
