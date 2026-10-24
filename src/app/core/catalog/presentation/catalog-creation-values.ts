import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface CatalogCreationValues {
  readonly title: string;
  readonly year: number;
  readonly language: SupportedLocale;
}
