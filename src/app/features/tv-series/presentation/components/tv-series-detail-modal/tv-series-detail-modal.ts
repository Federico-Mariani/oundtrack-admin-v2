import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { CatalogDetail } from '@app/core/catalog/presentation/catalog-detail';
import { SoundtrackOwnerType } from '@features/soundtracks';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { ModalService } from '@shared/ui/modal/modal.service';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import { CreateTvSeriesInfoModal } from '../create-tv-series-info-modal/create-tv-series-info-modal';
import type { TvSeriesDetailModalParams } from './tv-series-detail-modal-params';
@Component({
  selector: 'app-tv-series-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogDetail],
  template: `
    <app-catalog-detail
      translationScope="tv-series"
      [detail]="detail()"
      [owner]="owner"
      [loading]="facade.requests.getById.isLoading()"
      [error]="facade.requests.getById.error()"
      [(selectedLocale)]="selectedLocale"
      (refresh)="reload()"
      (createTranslation)="addLanguage($event)"
    />
  `,
})
export class TvSeriesDetailModal implements ModalContent<TvSeriesDetailModalParams, void> {
  readonly params = injectBrnDialogContext<{ params: TvSeriesDetailModalParams }>().params;
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
  protected readonly facade = inject(TvSeriesFacade);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private createInfoRef?: BrnDialogRef<SupportedLocale>;
  protected readonly selectedLocale = signal<SupportedLocale | null>(null);
  protected readonly owner = { type: SoundtrackOwnerType.TvSeries, id: this.params.id };
  protected readonly detail = computed(() => {
    const entity = this.facade.data.detail();
    return entity?.id === this.params.id
      ? { ...entity, externalId: entity.externalTvSeriesId }
      : null;
  });
  constructor() {
    this.reload();
    inject(DestroyRef).onDestroy(() => {
      this.facade.actions.closeDetail(this.params.id);
    });
  }
  protected reload(): void {
    this.facade.actions.loadDetail(this.params.id);
  }
  protected addLanguage(languages: ReadonlyArray<SupportedLocale>): void {
    if (this.createInfoRef) {
      return;
    }
    this.createInfoRef = this.modals.open(
      CreateTvSeriesInfoModal,
      { id: this.params.id, languages },
      { viewContainerRef: this.viewContainerRef, disableClose: true },
    );
    this.createInfoRef.closed$.subscribe((language) => {
      this.createInfoRef = undefined;
      if (language) {
        this.selectedLocale.set(language);
        this.reload();
      }
    });
  }
}
