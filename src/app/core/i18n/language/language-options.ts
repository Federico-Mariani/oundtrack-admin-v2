import type { SupportedLanguage } from './supported-language';

export interface LanguageOption {
  readonly code: SupportedLanguage;
  readonly label: string;
}

export const LANGUAGE_OPTIONS = [
  {
    code: 'en',
    label: 'English',
  },
  {
    code: 'it',
    label: 'Italiano',
  },
] as const satisfies readonly LanguageOption[];
