import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { isTheme, type Theme } from '../theme';

const THEME_STORAGE_KEY = 'app.theme';

@Injectable({ providedIn: 'root' })
export class ThemeStorage {
  private readonly document = inject(DOCUMENT);

  read(): Theme | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);

      return value && isTheme(value) ? value : null;
    } catch {
      return null;
    }
  }

  write(theme: Theme): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable.
    }
  }
}
