import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { SupportedLanguage } from './supported-language';

export function toSupportedLocale(language: SupportedLanguage): SupportedLocale {
  switch (language) {
    case 'it':
      return 'it-IT';

    case 'en':
      return 'en-US';
  }
}
