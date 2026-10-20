import type { Id } from '@shared/types/id';
import type { SupportedLocale } from '@shared/localization/supported-locale';

export interface CreateTvSeriesInfoCommand {
  readonly id: Id;
  readonly language: SupportedLocale;
}
