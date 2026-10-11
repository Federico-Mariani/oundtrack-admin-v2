import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import type { SupportedLanguage } from '../language/supported-language';

@Injectable({ providedIn: 'root' })
export class DocumentLanguage {
  private readonly document = inject(DOCUMENT);

  set(language: SupportedLanguage): void {
    this.document.documentElement.lang = language;
  }
}
