import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';

export const AUTH_I18N_SCOPE = 'auth';

export const authTranslationsLoader = createTranslationLoader({
  en: {
    errors: () => import('./en/errors.json'),
    components: {
      loginForm: () => import('./en/components/login-form.json'),
    },
  },
  it: {
    errors: () => import('./it/errors.json'),
    components: {
      loginForm: () => import('./it/components/login-form.json'),
    },
  },
});
