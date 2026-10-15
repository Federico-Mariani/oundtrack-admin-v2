import type { Id } from '@shared/types/id';
import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface CreateMovieInfoModalParams {
  readonly id: Id;
  readonly languages: readonly SupportedLocale[];
}
