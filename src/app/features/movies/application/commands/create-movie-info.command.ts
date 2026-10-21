import type { Id } from '@shared/types/id';
import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface CreateMovieInfoCommand {
  readonly id: Id;
  readonly language: SupportedLocale;
}
