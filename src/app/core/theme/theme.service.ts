import { computed, inject, Injectable, signal, type Signal } from '@angular/core';
import { ThemeStorage } from './theme-storage';
import { DEFAULT_THEME, type Theme } from './theme';

/**
 * Small, application-wide UI capability for the active color theme. It is NOT a
 * domain/business concept: it only resolves the initial theme, applies changes
 * and mirrors them (persistence + the document `.dark` class), exposing the
 * active theme as a read-only Signal for convenience.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(ThemeStorage);
  private readonly theme = signal<Theme>(DEFAULT_THEME);

  /** The active theme as a read-only Signal. */
  readonly activeTheme: Signal<Theme> = this.theme.asReadonly();

  /** Whether the dark theme is currently active. */
  readonly isDark: Signal<boolean> = computed(() => this.theme() === 'dark');

  /**
   * Resolves and applies the initial theme deterministically:
   * stored preference → OS/browser preference → light fallback.
   */
  initialize(): void {
    this.apply(this.resolveInitialTheme());
  }

  /** Switches between light and dark themes at runtime. */
  toggle(): void {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  /** Sets the active theme at runtime. */
  change(theme: Theme): void {
    this.apply(theme);
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    this.storage.write(theme);
    this.storage.reflectDocumentTheme(theme);
  }

  private resolveInitialTheme(): Theme {
    return this.storage.read() ?? (this.storage.prefersDark() ? 'dark' : DEFAULT_THEME);
  }
}
