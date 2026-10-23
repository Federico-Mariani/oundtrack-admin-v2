import { HintsListSkeleton } from '../hints-panel/hints-list-skeleton';
import { loadHintsPanel } from '../hints-panel/load-hints-panel';
import { Shimmer } from '@shared/ui/shimmer/shimmer';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
  type Type,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { Button } from '@shared/ui/button/button';
import type { HintOwner } from '../../../domain/values/hint-owner';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { HintsPanel } from '../hints-panel/hints-panel';
@Component({
  selector: 'app-hints-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    TranslocoDirective,
    Button,
    Shimmer,
    HintsListSkeleton,
  ],
  providers: [provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader })],
  template: ` <ng-container *transloco="let t; prefix: 'hints.editor'; loadingTpl: loading">
      @if (component(); as component) {
        <ng-container
          [ngComponentOutlet]="component"
          [ngComponentOutletInputs]="{ owner: owner(), locale: locale(), sessionId: sessionId() }"
        />
      } @else if (failed()) {
        <div class="space-y-3 py-8">
          <p role="alert">{{ t('loadError') }}</p>
          <app-button variant="outline" [text]="t('retry')" (click)="load()" />
        </div>
      } @else {
        <div class="min-h-48 space-y-4" role="status">
          <span class="sr-only">{{ t('loading') }}</span>
          <ng-container [ngTemplateOutlet]="loading" />
        </div>
      }
    </ng-container>
    <ng-template #loading
      ><div class="space-y-4">
        <div class="flex h-9 items-center justify-between">
          <app-shimmer class="h-6 w-24" /><app-shimmer class="h-9 w-32" />
        </div>
        <app-hints-list-skeleton /></div
    ></ng-template>`,
})
export class HintsOutlet {
  readonly sessionId = input.required<string>();
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
      const HintsPanel = await loadHintsPanel();
      if (!this.destroyRef.destroyed) this.component.set(HintsPanel);
    } catch {
      if (!this.destroyRef.destroyed) this.failed.set(true);
    }
  }
}
