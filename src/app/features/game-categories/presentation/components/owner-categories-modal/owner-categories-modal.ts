import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';
import { gameCategoriesTranslationsLoader } from '../../i18n/game-categories-translations.loader';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { resolveLocalized } from '@shared/localization/localized.queries';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import { Button } from '@shared/ui/button/button';
import { CheckboxChoice } from '@shared/ui/checkbox-choice/checkbox-choice';
import { TextInput } from '@shared/ui/text-input/text-input';
import { Shimmer } from '@shared/ui/shimmer/shimmer';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import type { OwnerCategoriesModalParams } from './owner-categories-modal-params';
@Component({
  selector: 'app-owner-categories-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, Button, CheckboxChoice, TextInput, Shimmer],
  providers: [
    provideTranslocoScope({ scope: 'gameCategories', loader: gameCategoriesTranslationsLoader }),
  ],
  templateUrl: './owner-categories-modal.html',
})
export class OwnerCategoriesModal implements ModalContent<OwnerCategoriesModalParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: OwnerCategoriesModalParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(GameCategoriesFacade);
  private readonly language = inject(LanguageService);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  private readonly sessionId = crypto.randomUUID();
  private readonly requestId = signal<string | null>(null);
  protected readonly selected = signal<ReadonlyArray<string>>([...this.params.categoryIds]);
  protected readonly values = signal({ search: '' });
  protected readonly fields = form(this.values);
  protected readonly loading = this.facade.requests.getAll.isLoading;
  protected readonly loaded = this.facade.data.loaded;
  protected readonly loadError = this.facade.requests.getAll.error;
  protected readonly saving = this.facade.requests.assignment.isLoading;
  protected readonly saveError = this.facade.requests.assignment.error;
  protected readonly changed = computed(
    () =>
      this.selected().length !== this.params.categoryIds.length ||
      this.selected().some((id) => !this.params.categoryIds.includes(id)),
  );
  protected readonly categories = computed(() => {
    const query = this.values().search.trim().toLocaleLowerCase(this.language.activeLocale());
    return this.facade.data
      .categories()
      .map((category) => ({
        id: category.id,
        name: resolveLocalized(category.info, this.language.activeLocale())?.name ?? category.id,
      }))
      .filter((category) =>
        category.name.toLocaleLowerCase(this.language.activeLocale()).includes(query),
      )
      .sort((a, b) => a.name.localeCompare(b.name, this.language.activeLocale()));
  });
  constructor() {
    this.facade.actions.openAssignment(this.sessionId);
    this.reload();
    inject(DestroyRef).onDestroy(() => {
      this.facade.actions.closeAssignment(this.sessionId);
    });
    effect(() => {
      if (!this.requestId() || this.facade.data.assignmentId() !== this.requestId()) return;
      if (this.facade.requests.assignment.isSuccess())
        untracked(() => {
          this.notifications.success(this.transloco.translate('gameCategories.assignment.success'));
          this.ref.close(true);
        });
      else if (this.saveError())
        untracked(() => {
          this.notifications.error(this.transloco.translate('gameCategories.assignment.failed'));
        });
    });
  }
  protected reload(): void {
    this.facade.actions.getAll();
  }
  protected toggle(id: string): void {
    if (this.saving()) return;
    this.selected.update((selected) =>
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
  }
  protected save(): void {
    if (this.saving() || this.loading() || !this.loaded() || this.loadError() || !this.changed())
      return;
    const requestId = crypto.randomUUID();
    this.requestId.set(requestId);
    this.facade.actions.assign(this.sessionId, requestId, {
      owner: this.params.owner,
      categoryIds: this.selected(),
    });
  }
}
