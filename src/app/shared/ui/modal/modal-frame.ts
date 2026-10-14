import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { TranslocoDirective, provideTranslocoScope } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { HlmDialogTitle, HlmDialogDescription } from '@spartan-ng/helm/dialog';
import { IconButton } from '../icon-button/icon-button';

/** Shared accessible chrome, used inside a dedicated modal component only. */
@Component({
  selector: 'app-modal-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, IconButton, HlmDialogTitle, HlmDialogDescription],
  providers: [provideIcons({ lucideX })],
  viewProviders: [
    provideTranslocoScope({
      scope: 'modal',
      loader: {
        en: () => import('./i18n/en.json').then((m) => m.default),
        it: () => import('./i18n/it.json').then((m) => m.default),
      },
    }),
  ],
  host: { class: 'block' },
  template: `
    <div *transloco="let t; prefix: 'modal'" class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 hlmDialogTitle class="text-lg font-semibold">{{ title() }}</h2>
        <p hlmDialogDescription class="mt-1 text-sm text-muted-foreground">
          {{ description() }}
        </p>
      </div>
      <app-icon-button
        icon="lucideX"
        variant="ghost"
        size="icon-sm"
        [ariaLabel]="t('close')"
        (click)="ref.close()"
      />
    </div>
    <ng-content />
  `,
})
export class ModalFrame {
  protected readonly ref = inject<BrnDialogRef>(BrnDialogRef);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
