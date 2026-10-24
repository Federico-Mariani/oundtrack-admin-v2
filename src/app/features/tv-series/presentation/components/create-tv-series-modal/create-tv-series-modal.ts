import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { CatalogCreationForm } from '@app/core/catalog/presentation/catalog-creation-form';
import type { CatalogCreationValues } from '@app/core/catalog/presentation/catalog-creation-values';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import { tvSeriesTranslationsLoader } from '../../i18n/tv-series-translations.loader';

@Component({
  selector: 'app-create-tv-series-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, CatalogCreationForm],
  providers: [provideTranslocoScope({ scope: 'tvSeries', loader: tvSeriesTranslationsLoader })],
  template: `
    <app-modal-frame
      *transloco="let t; prefix: 'tvSeries.create'"
      [title]="t('title')"
      [description]="t('description')"
      [closeDisabled]="request.isLoading()"
    >
      <app-catalog-creation-form
        translationPrefix="tvSeries.create"
        [busy]="request.isLoading()"
        [error]="request.error()"
        (submitted)="create($event)"
        (cancelled)="ref.close(false)"
      />
    </app-modal-frame>
  `,
})
export class CreateTvSeriesModal implements ModalContent<undefined, boolean> {
  readonly params = injectBrnDialogContext<{ params: undefined }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(TvSeriesFacade);
  protected readonly request = this.facade.requests.create;
  constructor() {
    this.facade.actions.resetCreateTvSeries();
    effect(() => {
      if (this.request.isSuccess())
        untracked(() => {
          this.ref.close(true);
        });
    });
  }
  protected create(values: CatalogCreationValues): void {
    if (!this.request.isLoading()) this.facade.actions.createTvSeries(values);
  }
}
