import type { SelectItem } from '@shared/interfaces/select-item';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { provideTranslocoScope, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { MediaImage } from '@shared/ui/media-image/media-image';
import { Select } from '@shared/ui/select/select';
import { HintIcon } from '../hint-icon/hint-icon';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { isImageHint } from '../../../domain/values/hint-image-policy';
import { isSupportedLocale } from '@shared/localization/supported-locale';
import type { HintPreviewParams } from './hint-preview-params';
@Component({
  selector: 'app-hint-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, MediaImage, Select, HintIcon],
  providers: [provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader })],
  templateUrl: './hint-preview.html',
})
export class HintPreview implements ModalContent<HintPreviewParams, void> {
  readonly params = injectBrnDialogContext<{ params: HintPreviewParams }>().params;
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
  private readonly transloco = inject(TranslocoService);
  protected readonly locale = signal(this.params.locale);
  protected readonly visual = isImageHint(this.params.hint.type);
  protected readonly info = computed(() =>
    this.params.hint.info.find((info) => info.language === this.locale()),
  );
  protected readonly image = this.params.hint.info.find((info) => info.image)?.image;
  protected languageItems(): Array<SelectItem> {
    return this.params.hint.info.map((info) => ({
      value: info.language,
      label: this.transloco.translate('hints.editor.languages.' + info.language),
    }));
  }
  protected changeLanguage(value: string): void {
    if (isSupportedLocale(value) && this.params.hint.info.some((info) => info.language === value))
      this.locale.set(value);
  }
}
