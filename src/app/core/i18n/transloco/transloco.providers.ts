import {
    type EnvironmentProviders,
    inject,
    isDevMode,
    makeEnvironmentProviders,
    provideAppInitializer,
} from '@angular/core';
import {
    provideTransloco,
    translocoConfig,
} from '@jsverse/transloco';

import { LanguageService } from '../language/language.service';
import { RootTranslocoLoader } from './root-transloco.loader';
import {
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
} from '../language/supported-language';

export function provideAppTransloco(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideTransloco({
            config: translocoConfig({
                availableLangs: [...SUPPORTED_LANGUAGES],
                defaultLang: DEFAULT_LANGUAGE,
                fallbackLang: DEFAULT_LANGUAGE,
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
                missingHandler: {
                    useFallbackTranslation: true,
                    logMissingKey: isDevMode(),
                },
            }),
            loader: RootTranslocoLoader,
        }),

        provideAppInitializer(() => {
            inject(LanguageService).initialize();
        }),
    ]);
}