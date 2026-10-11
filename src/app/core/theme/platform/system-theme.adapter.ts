import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SystemTheme {
  private readonly document = inject(DOCUMENT);

  prefersDark(): boolean {
    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
  }
}
