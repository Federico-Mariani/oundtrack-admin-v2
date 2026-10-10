import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { normalizeLanguage } from '../language/language-normalizer';
import type { SupportedLanguage } from '../language/supported-language';

@Injectable({ providedIn: 'root' })
export class BrowserLanguage {
    private readonly document = inject(DOCUMENT);

    read(): SupportedLanguage | null {
        const language =
            this.document.defaultView?.navigator.language;

        return normalizeLanguage(language);
    }
}