import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import type { Theme } from '../theme';

const DARK_THEME_CLASS = 'dark';

@Injectable({ providedIn: 'root' })
export class DocumentTheme {
    private readonly document = inject(DOCUMENT);

    set(theme: Theme): void {
        this.document.documentElement.classList.toggle(
            DARK_THEME_CLASS,
            theme === 'dark',
        );
    }
}