import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { CatalogCreationForm } from '@app/core/catalog/presentation/catalog-creation-form';
import type { CatalogCreationValues } from '@app/core/catalog/presentation/catalog-creation-values';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';

@Component({
  selector: 'app-create-movie-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, CatalogCreationForm],
  providers: [provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader })],
  template: `
    <app-modal-frame
      *transloco="let t; prefix: 'movies.create'"
      [title]="t('title')"
      [description]="t('description')"
      [closeDisabled]="request.isLoading()"
    >
      <app-catalog-creation-form
        translationPrefix="movies.create"
        [busy]="request.isLoading()"
        [error]="request.error()"
        (submitted)="create($event)"
        (cancelled)="ref.close(false)"
      />
    </app-modal-frame>
  `,
})
export class CreateMovieModal implements ModalContent<undefined, boolean> {
  readonly params = injectBrnDialogContext<{ params: undefined }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(MoviesFacade);
  protected readonly request = this.facade.requests.create;
  constructor() {
    this.facade.actions.resetCreateMovie();
    effect(() => {
      if (this.request.isSuccess())
        untracked(() => {
          this.ref.close(true);
        });
    });
  }
  protected create(values: CatalogCreationValues): void {
    if (!this.request.isLoading()) this.facade.actions.createMovie(values);
  }
}
