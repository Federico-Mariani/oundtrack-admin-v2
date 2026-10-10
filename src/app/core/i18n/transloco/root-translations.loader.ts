import { createTranslationLoader } from './translation-loader';

export const ROOT_TRANSLATIONS_LOADER = createTranslationLoader({
    en: {
        validation: () => import('@app/core/i18n/translations/en/validation.json'),

        components: {
            sidebar: () => import('@app/core/i18n/translations/en/components/sidebar.json'),
        },
    },

    it: {
        validation: () => import('@app/core/i18n/translations/it/validation.json'),

        components: {
            sidebar: () => import('@app/core/i18n/translations/it/components/sidebar.json'),
        },
    },
});