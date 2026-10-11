import { Injectable } from '@angular/core';
import type { Translation, TranslocoLoader } from '@jsverse/transloco';

import { ROOT_TRANSLATIONS_LOADER } from './root-translations.loader';
import { DEFAULT_LANGUAGE, isSupportedLanguage } from '../language/supported-language';

@Injectable({ providedIn: 'root' })
export class RootTranslocoLoader implements TranslocoLoader {
  getTranslation(language: string): Promise<Translation> {
    const resolvedLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

    return ROOT_TRANSLATIONS_LOADER[resolvedLanguage]();
  }
}
