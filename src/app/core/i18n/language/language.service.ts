import {inject, Injectable, Signal} from "@angular/core";
import {TranslocoService} from "@jsverse/transloco";
import {LanguageStorage} from "@app/core/i18n/platform/language-storage";
import {BrowserLanguage} from "@app/core/i18n/platform/browser-language";
import {DocumentLanguage} from "@app/core/i18n/platform/document-language";
import {DEFAULT_LANGUAGE, isSupportedLanguage, SupportedLanguage} from "@app/core/i18n/language/supported-language";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {LANGUAGE_OPTIONS, LanguageOption} from "@app/core/i18n/language/language-options";

@Injectable({ providedIn: 'root' })
export class LanguageService {
    private readonly transloco = inject(TranslocoService);
    private readonly storage = inject(LanguageStorage);
    private readonly browserLanguage = inject(BrowserLanguage);
    private readonly documentLanguage = inject(DocumentLanguage);

    readonly activeLanguage: Signal<SupportedLanguage> = toSignal(
        this.transloco.langChanges$.pipe(
            map((language) => this.resolveSupportedLanguage(language)),
        ),
        {
            initialValue: this.resolveSupportedLanguage(
                this.transloco.getActiveLang(),
            ),
        },
    );

    readonly options: readonly LanguageOption[] = LANGUAGE_OPTIONS;

    initialize(): void {
        this.setLanguage(this.resolveInitialLanguage());
    }

    change(language: SupportedLanguage): void {
        this.setLanguage(language);
    }

    private setLanguage(language: SupportedLanguage): void {
        this.transloco.setActiveLang(language);
        this.storage.write(language);
        this.documentLanguage.set(language);
    }

    private resolveInitialLanguage(): SupportedLanguage {
        return (
            this.storage.read() ??
            this.browserLanguage.read() ??
            DEFAULT_LANGUAGE
        );
    }

    private resolveSupportedLanguage(
        language: string,
    ): SupportedLanguage {
        return isSupportedLanguage(language)
            ? language
            : DEFAULT_LANGUAGE;
    }
}