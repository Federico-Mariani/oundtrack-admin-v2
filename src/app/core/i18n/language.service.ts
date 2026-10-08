import { inject, Injectable, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageStorage } from './language-storage';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_OPTIONS,
  type LanguageOption,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './supported-language';

/**
 * Small, application-wide UI capability for the active language. It is NOT a
 * domain/business concept and does NOT duplicate Transloco's state: Transloco
 * remains the source of truth for the active language; this service only
 * resolves the initial language, applies changes and mirrors them (persistence
 * + `<html lang>`), exposing a read-only Signal for convenience.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly storage = inject(LanguageStorage);

  /** The languages the application supports. */
  readonly supportedLanguages: readonly SupportedLanguage[] = SUPPORTED_LANGUAGES;

  /** User-facing language metadata (code + label) for selectors. */
  readonly options: readonly LanguageOption[] = LANGUAGE_OPTIONS;

  /** The active language as a read-only Signal, derived from Transloco. */
  readonly activeLanguage: Signal<SupportedLanguage> = toSignal(
    this.transloco.langChanges$.pipe(map((lang) => this.toSupported(lang))),
    { initialValue: this.currentLanguage() },
  );

  /**
   * Resolves and applies the initial language deterministically:
   * stored preference → browser language → English fallback.
   */
  initialize(): void {
    this.apply(this.resolveInitialLanguage());
  }

  /** Switches the active UI language at runtime (no full page reload). */
  change(language: SupportedLanguage): void {
    this.apply(language);
  }

  private apply(language: SupportedLanguage): void {
    this.transloco.setActiveLang(language);
    this.storage.write(language);
    this.storage.reflectDocumentLanguage(language);
  }

  private resolveInitialLanguage(): SupportedLanguage {
    return this.storage.read() ?? this.storage.browserLanguage() ?? DEFAULT_LANGUAGE;
  }

  private currentLanguage(): SupportedLanguage {
    return this.toSupported(this.transloco.getActiveLang());
  }

  private toSupported(language: string): SupportedLanguage {
    return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
  }
}
