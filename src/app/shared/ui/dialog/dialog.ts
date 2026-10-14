import { ChangeDetectionStrategy, Component, input, model, type TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoDirective, provideTranslocoScope } from '@jsverse/transloco';
import {
  HlmDialog,
  HlmDialogContent,
  HlmDialogPortal,
  HlmDialogTitle,
  HlmDialogDescription,
} from '@spartan-ng/helm/dialog';
@Component({
  selector: 'app-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    TranslocoDirective,
    HlmDialog,
    HlmDialogContent,
    HlmDialogPortal,
    HlmDialogTitle,
    HlmDialogDescription,
  ],
  viewProviders: [
    provideTranslocoScope({
      scope: 'dialog',
      loader: {
        en: () => import('./i18n/en.json').then((m) => m.default),
        it: () => import('./i18n/it.json').then((m) => m.default),
      },
    }),
  ],
  templateUrl: './dialog.html',
})
export class Dialog {
  readonly open = model(false);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly content = input.required<TemplateRef<unknown>>();
}
