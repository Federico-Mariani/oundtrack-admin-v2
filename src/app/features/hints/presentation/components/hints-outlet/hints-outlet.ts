import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
  type Type,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { Button } from '@shared/ui/button/button';
import type { HintOwner } from '../../../domain/values/hint-owner';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { HintsPanel } from '../hints-panel/hints-panel';
@Component({
  selector: 'app-hints-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, TranslocoDirective, Button],
  providers: [provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader })],
  template: ` <ng-container *transloco="let t; prefix: 'hints.editor'">
    @if (component(); as component) {
      <ng-container
        [ngComponentOutlet]="component"
        [ngComponentOutletInputs]="{ owner: owner(), locale: locale() }"
      />
    } @else if (failed()) {
      <div class="space-y-3 py-8">
        <p role="alert">{{ t('loadError') }}</p>
        <app-button variant="outline" [text]="t('retry')" (click)="load()" />
      </div>
    } @else {
      <p role="status" class="py-8 text-sm text-muted-foreground">{{ t('loading') }}</p>
    }
  </ng-container>`,
})
export class HintsOutlet {
  readonly owner = input.required<HintOwner>();
  readonly locale = input.required<SupportedLocale>();
  protected readonly component = signal<Type<HintsPanel> | null>(null);
  protected readonly failed = signal(false);
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    void this.load();
  }
  protected async load(): Promise<void> {
    this.failed.set(false);
    try {
      const { HintsPanel } = await import('../hints-panel/hints-panel');
      if (!this.destroyRef.destroyed) this.component.set(HintsPanel);
    } catch {
      if (!this.destroyRef.destroyed) this.failed.set(true);
    }
  }
}
