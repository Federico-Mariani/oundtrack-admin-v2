/**
 * Single, typed source of truth for the UI color themes the application
 * supports. A theme is a UI preference, not a domain concept: it only toggles
 * the `.dark` class on the document element (see `styles.css`).
 */
export const THEMES = ['light', 'dark'] as const;

/** A color theme supported by the application. */
export type Theme = (typeof THEMES)[number];

/** Default theme used when no preference is stored and none can be inferred. */
export const DEFAULT_THEME: Theme = 'light';

/** Type guard narrowing an arbitrary string to a supported theme. */
export function isTheme(value: string | null | undefined): value is Theme {
  return value !== null && value !== undefined && (THEMES as readonly string[]).includes(value);
}
