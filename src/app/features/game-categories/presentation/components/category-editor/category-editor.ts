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
import { disabled, form, maxLength } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';
import { gameCategoriesTranslationsLoader } from '../../i18n/game-categories-translations.loader';
import { ImageSelection } from '@app/core/uploads/image-selection';
import { NotificationService } from '@app/core/notifications/notification.service';
import { SupportedLocale, SUPPORTED_LOCALES } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import { Button } from '@shared/ui/button/button';
import { TextInput } from '@shared/ui/text-input/text-input';
import { ImageUploadField } from '@shared/ui/image-upload-field/image-upload-field';
import { UploadProgress } from '@shared/ui/upload-progress/upload-progress';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import type { CategoryEditorParams } from './category-editor-params';
import { RequestErrorCode } from '@shared/state/request/request-error';
@Component({
  selector: 'app-category-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, Button, TextInput, ImageUploadField, UploadProgress],
  providers: [
    ImageSelection,
    provideTranslocoScope({ scope: 'gameCategories', loader: gameCategoriesTranslationsLoader }),
  ],
  templateUrl: './category-editor.html',
})
export class CategoryEditor implements ModalContent<CategoryEditorParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: CategoryEditorParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(GameCategoriesFacade);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  private readonly sessionId = crypto.randomUUID();
  private readonly requestId = signal<string | null>(null);
  protected readonly selection = inject(ImageSelection);
  protected readonly locales = SUPPORTED_LOCALES;
  protected readonly values = signal<Record<SupportedLocale, string>>({
    [SupportedLocale.Italian]: this.params.category?.info[SupportedLocale.Italian]?.name ?? '',
    [SupportedLocale.English]: this.params.category?.info[SupportedLocale.English]?.name ?? '',
  });
  protected readonly busy = this.facade.requests.save.isLoading;
  protected readonly error = this.facade.requests.save.error;
  protected readonly uncertain = this.facade.data.categoryCreationUncertain;
  protected readonly prepared = this.facade.data.preparedCategory;
  protected readonly phase = this.facade.data.categoryPhase;
  protected readonly progress = this.facade.data.categoryProgress;
  protected readonly locked = computed(() => this.busy() || this.uncertain());
  protected readonly fields = form(this.values, (schema) => {
    for (const locale of SUPPORTED_LOCALES) {
      disabled(schema[locale], { when: () => this.locked() });
      maxLength(schema[locale], 255);
    }
  });
  protected readonly submitted = signal(false);
  protected readonly names = computed(() =>
    this.locales
      .filter((language) => this.values()[language].trim())
      .map((language) => ({ language, name: this.values()[language].trim() })),
  );
  protected readonly changed = computed(
    () =>
      !!this.selection.fileKey() ||
      this.names().some((info) => this.params.category?.info[info.language]?.name !== info.name),
  );
  protected readonly removedExisting = computed(() =>
    this.locales.some(
      (locale) => !!this.params.category?.info[locale] && !this.values()[locale].trim(),
    ),
  );
  protected readonly image = computed(
    () => this.prepared()?.image ?? this.params.category?.image ?? null,
  );
  protected readonly nameErrors = computed(() => this.error()?.fieldErrors?.['name'] ?? []);
  protected readonly errorKey = computed(() =>
    this.uncertain()
      ? 'uncertain'
      : this.error()?.code === RequestErrorCode.Conflict
        ? 'conflict'
        : 'failed',
  );
  constructor() {
    this.facade.actions.openEditor(this.sessionId);
    inject(DestroyRef).onDestroy(() => {
      if (this.uncertain()) this.facade.actions.getAll();
      this.facade.actions.closeEditor(this.sessionId);
    });
    effect(() => {
      if (!this.requestId() || this.facade.data.saveId() !== this.requestId()) return;
      if (this.facade.requests.save.isSuccess())
        untracked(() => {
          this.notifications.success(this.transloco.translate('gameCategories.editor.success'));
          this.ref.close(true);
        });
      else if (this.error())
        untracked(() => {
          this.notifications.error(
            this.transloco.translate('gameCategories.editor.' + this.errorKey()),
          );
        });
    });
  }
  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    for (const locale of this.locales) this.fields[locale]().markAsTouched();
    if (
      this.busy() ||
      this.uncertain() ||
      this.selection.checking() ||
      !this.names().length ||
      this.removedExisting() ||
      !this.fields().valid() ||
      (!this.changed() && !this.prepared())
    )
      return;
    const requestId = crypto.randomUUID();
    this.requestId.set(requestId);
    this.facade.actions.saveCategory(this.sessionId, requestId, {
      categoryId: this.params.category?.id,
      names: this.names(),
      fileKey: this.selection.fileKey() ?? undefined,
    });
  }
  protected cancel(): void {
    this.ref.close(!!this.prepared() || this.uncertain());
  }
}
