import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslocoDirective, provideTranslocoScope } from '@jsverse/transloco';
import { ListFilters } from '../../list-filters/list-filters';
import { Button } from '../../button/button';
import { ModalFrame } from '../../modal/modal-frame';
import type { ModalContent } from '../../modal/modal-content';
import type { ListFiltersModalParams } from './list-filters-modal-params';

@Component({
  selector: 'app-list-filters-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, ListFilters, Button],
  viewProviders: [
    provideTranslocoScope({
      scope: 'list-controls',
      alias: 'listControls',
      loader: {
        en: () => import('../i18n/en.json').then((m) => m.default),
        it: () => import('../i18n/it.json').then((m) => m.default),
      },
    }),
  ],
  template: `
    <app-modal-frame
      *transloco="let t; prefix: 'listControls'"
      [title]="t('title')"
      [description]="t('hint')"
    >
      <div class="flex flex-col gap-5">
        <app-list-filters [fields]="params.fields()" />
        <app-button variant="outline" [text]="t('reset')" (click)="params.reset()" />
      </div>
    </app-modal-frame>
  `,
})
export class ListFiltersModal implements ModalContent<ListFiltersModalParams, void> {
  readonly params = inject<ListFiltersModalParams>(DIALOG_DATA);
  readonly ref = inject<DialogRef<void>>(DialogRef);
}
