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
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { CreateMovieInfoModal } from '../create-movie-info-modal/create-movie-info-modal';
import type { MovieDetailModalParams } from './movie-detail-modal-params';
@Component({
  selector: 'app-movie-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogDetail],
  template: `
    <app-catalog-detail
      translationScope="movies"
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
export class MovieDetailModal implements ModalContent<MovieDetailModalParams, void> {
  readonly params = injectBrnDialogContext<{ params: MovieDetailModalParams }>().params;
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
  protected readonly facade = inject(MoviesFacade);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private createInfoRef?: BrnDialogRef<SupportedLocale>;
  protected readonly selectedLocale = signal<SupportedLocale | null>(null);
  protected readonly owner = { type: SoundtrackOwnerType.Movie, id: this.params.id };
  protected readonly detail = computed(() => {
    const entity = this.facade.data.detail();
    return entity?.id === this.params.id ? { ...entity, externalId: entity.externalMovieId } : null;
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
      CreateMovieInfoModal,
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
