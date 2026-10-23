import type { HintModel } from '../../../domain/models/hint.model';
import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface HintPreviewParams {
  readonly hint: HintModel;
  readonly locale: SupportedLocale;
}
