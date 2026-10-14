import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface MovieListFilters {
  readonly infoLanguage?: SupportedLocale;
  readonly releaseYearFrom?: number;
  readonly releaseYearTo?: number;
  readonly externalMovieId?: number;
}
