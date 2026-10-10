export const THEMES = ['light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'light';

export function isTheme(value: string): value is Theme {
    return THEMES.some((theme) => theme === value);
}