import { computed, inject, Injectable, signal, type Signal } from '@angular/core';

import { DocumentTheme } from './platform/document-theme.adapter';
import { SystemTheme } from './platform/system-theme.adapter';
import { ThemeStorage } from './platform/theme-storage.adapter';
import { DEFAULT_THEME, type Theme } from './theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(ThemeStorage);
  private readonly systemTheme = inject(SystemTheme);
  private readonly documentTheme = inject(DocumentTheme);

  private readonly theme = signal<Theme>(DEFAULT_THEME);

  readonly activeTheme: Signal<Theme> = this.theme.asReadonly();

  readonly isDark: Signal<boolean> = computed(() => this.theme() === 'dark');

  initialize(): void {
    this.setTheme(this.resolveInitialTheme());
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  change(theme: Theme): void {
    this.setTheme(theme);
  }

  private setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.storage.write(theme);
    this.documentTheme.set(theme);
  }

  private resolveInitialTheme(): Theme {
    return this.storage.read() ?? (this.systemTheme.prefersDark() ? 'dark' : DEFAULT_THEME);
  }
}
