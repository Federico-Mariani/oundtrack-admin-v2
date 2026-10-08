import {
  type EnvironmentProviders,
  inject,
  Injectable,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import {
  provideTransloco,
  type Translation,
  translocoConfig,
  type TranslocoLoader,
} from '@jsverse/transloco';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './supported-language';
import { LanguageService } from './language.service';

/**
 * Global, scope-less app-shell translation areas, keyed by language. These are
 * genuinely application-wide, feature-agnostic texts (e.g. form validation
 * messages reused by shared UI inputs), loaded eagerly in the root namespace so
 * any component can resolve them with a full key (`validation.required`),
 * regardless of the lazy feature scope it happens to sit under. This loader
 * must therefore NEVER know about any feature.
 */
const ROOT_TRANSLATION_LOADERS: Readonly<
  Record<SupportedLanguage, () => Promise<{ readonly default: Translation }>>
> = {
  en: () => import('./en/validation.json'),
  it: () => import('./it/validation.json'),
};

/**
 * Root translation loader. It exposes only global app-shell copy under semantic
 * namespaces (currently `validation.*`); feature translations stay lazy via
 * `provideTranslocoScope()` in each feature's routing. This root loader must
 * therefore NEVER know about any feature.
 */
@Injectable({ providedIn: 'root' })
export class RootTranslocoLoader implements TranslocoLoader {
  async getTranslation(language: string): Promise<Translation> {
    const loadValidation = ROOT_TRANSLATION_LOADERS[language as SupportedLanguage];
    const validation = (await loadValidation()).default;

    return { validation };
  }
}

/**
 * Technical, application-wide Transloco configuration. Registered once at the
 * composition root. English is the default and official fallback; missing
 * translations fall back to it so behavior is predictable.
 */
export function provideAppTransloco(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTransloco({
      config: translocoConfig({
        availableLangs: [...SUPPORTED_LANGUAGES],
        defaultLang: DEFAULT_LANGUAGE,
        fallbackLang: DEFAULT_LANGUAGE,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: { useFallbackTranslation: true, logMissingKey: isDevMode() },
      }),
      loader: RootTranslocoLoader,
    }),
    provideAppInitializer(() => {
      inject(LanguageService).initialize();
    }),
  ]);
}
