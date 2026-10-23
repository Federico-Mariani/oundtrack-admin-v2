import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface HintInfoModel {
  readonly id: string;
  readonly language: SupportedLocale;
  readonly text: string | null;
  readonly image: string | null;
}
