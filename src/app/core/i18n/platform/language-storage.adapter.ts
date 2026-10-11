import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { isSupportedLanguage, type SupportedLanguage } from '../language/supported-language';

const LANGUAGE_STORAGE_KEY = 'app.language';

@Injectable({ providedIn: 'root' })
export class LanguageStorage {
  private readonly document = inject(DOCUMENT);

  read(): SupportedLanguage | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(LANGUAGE_STORAGE_KEY);

      return value && isSupportedLanguage(value) ? value : null;
    } catch {
      return null;
    }
  }

  write(language: SupportedLanguage): void {
    try {
      this.document.defaultView?.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage may be unavailable or blocked.
    }
  }
}
