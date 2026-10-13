import type { Translation } from '@jsverse/transloco';

/** Component-owned translations: shared UI has no dependency on core or feature loaders. */
export const dataTableTranslationsLoader = {
  en: (): Promise<Translation> => import('./en.json').then((translation) => translation.default),
  it: (): Promise<Translation> => import('./it.json').then((translation) => translation.default),
};
