import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  isSupportedLanguage,
  normalizeLanguage,
  type SupportedLanguage,
} from './supported-language';

/** Centralized key for persisting the UI language preference. */
export const LANGUAGE_STORAGE_KEY = 'app.language';

/**
 * Technical adapter around the browser language concerns (`localStorage`,
 * `navigator.language`, `<html lang>`). It is the single, SSR-safe place that
 * touches these globals so features never reach for `window` / `document`.
 */
@Injectable({ providedIn: 'root' })
export class LanguageStorage {
  private readonly document = inject(DOCUMENT);

  /** Reads the previously stored, still-valid language preference (or `null`). */
  read(): SupportedLanguage | null {
    const stored = this.storage?.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : null;
  }

  /** Persists the chosen language preference. */
  write(language: SupportedLanguage): void {
    this.storage?.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  /** The browser's preferred language normalized to a supported code (or `null`). */
  browserLanguage(): SupportedLanguage | null {
    const navigatorRef = this.window?.navigator;
    return normalizeLanguage(navigatorRef?.language);
  }

  /** Reflects the active language on the document element for accessibility. */
  reflectDocumentLanguage(language: SupportedLanguage): void {
    this.document.documentElement.lang = language;
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
