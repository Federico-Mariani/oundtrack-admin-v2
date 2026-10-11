import type { SupportedLocale } from './supported-locale';

export type Localized<T> = Readonly<Partial<Record<SupportedLocale, T>>>;
