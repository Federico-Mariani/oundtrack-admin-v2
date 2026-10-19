import type { Id } from '@shared/types/id';
import type { SupportedLocale } from '@shared/localization/supported-locale';

export interface CreateTvSeriesInfoModalParams {
  readonly id: Id;
  readonly languages: ReadonlyArray<SupportedLocale>;
}
