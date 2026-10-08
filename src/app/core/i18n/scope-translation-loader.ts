import type { Translation } from '@jsverse/transloco';
import type { SupportedLanguage } from './supported-language';

/** Lazily imports one translation area (a single JSON file) of a scope. */
export type TranslationAreaLoader = () => Promise<{ readonly default: Translation }>;

/** The translation areas (JSON files) that compose a scope for one language. */
export type ScopeTranslationAreas = Readonly<Record<string, TranslationAreaLoader>>;

/** Per-language description of every file that composes a feature scope. */
export type ScopeTranslationMap = Readonly<Record<SupportedLanguage, ScopeTranslationAreas>>;

/** The inline-loader shape expected by `provideTranslocoScope({ loader })`. */
export type ScopeInlineLoader = Record<string, () => Promise<Translation>>;

/**
 * Composes several JSON files into a single, namespaced translation object per
 * language, so one scope can be split by meaningful area (`common`, `login`,
 * ...) without a giant file. Each area becomes a top-level namespace: files
 * `common.json` + `login.json` under scope `auth` yield the keys
 * `auth.common.*` and `auth.login.*`.
 *
 * This is the single shared i18n primitive: feature loaders only declare WHICH
 * files compose their scope; the merge behavior lives here once (DRY) instead
 * of being copy-pasted in every feature.
 */
export function composeScopeLoader(areasByLanguage: ScopeTranslationMap): ScopeInlineLoader {
  const loader: ScopeInlineLoader = {};
  for (const [language, areas] of Object.entries(areasByLanguage)) {
    loader[language] = (): Promise<Translation> => loadAreas(areas);
  }
  return loader;
}

async function loadAreas(areas: ScopeTranslationAreas): Promise<Translation> {
  const entries = Object.entries(areas);
  const loaded = await Promise.all(
    entries.map(([area, load]) => load().then((module) => [area, module.default] as const)),
  );
  return Object.fromEntries<Translation>(loaded);
}
