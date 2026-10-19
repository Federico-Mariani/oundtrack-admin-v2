import type { RequestErrorCode } from '@shared/state/request/request-error';
import { TV_SERIES_I18N_SCOPE } from './tv-series-translations.loader';

export type TvSeriesErrorOperation = 'get-all';

export function tvSeriesErrorTranslationKey(
  operation: TvSeriesErrorOperation,
  code: RequestErrorCode,
): string {
  return `${TV_SERIES_I18N_SCOPE}.${operation}.${code}`;
}
