import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isTheme, type Theme } from './theme';

/** Centralized key for persisting the UI theme preference. */
export const THEME_STORAGE_KEY = 'app.theme';

/** CSS class toggled on the document element to activate the dark theme. */
const DARK_THEME_CLASS = 'dark';

/**
 * Technical adapter around the browser theme concerns (`localStorage`,
 * `prefers-color-scheme`, the document `.dark` class). It is the single,
 * SSR-safe place that touches these globals so features never reach for
 * `window` / `document`.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStorage {
  private readonly document = inject(DOCUMENT);

  /** Reads the previously stored, still-valid theme preference (or `null`). */
  read(): Theme | null {
    const stored = this.storage?.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  }

  /** Persists the chosen theme preference. */
  write(theme: Theme): void {
    this.storage?.setItem(THEME_STORAGE_KEY, theme);
  }

  /** Whether the user's OS/browser prefers a dark color scheme. */
  prefersDark(): boolean {
    return this.window?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
  }

  /** Reflects the active theme on the document element via the `.dark` class. */
  reflectDocumentTheme(theme: Theme): void {
    this.document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === 'dark');
  }

  private get window(): (Window & typeof globalThis) | null {
    return this.document.defaultView;
  }

  private get storage(): Storage | null {
    try {
      return this.window?.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
