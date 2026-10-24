import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface SaveCategoryCommand {
  readonly categoryId?: string;
  readonly names: ReadonlyArray<{ readonly language: SupportedLocale; readonly name: string }>;
  readonly fileKey?: string;
}
