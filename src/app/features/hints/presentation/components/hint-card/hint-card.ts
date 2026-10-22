import { isImageHint } from '../../../domain/values/hint-image-policy';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCoins,
  lucideEllipsis,
  lucideUserRound,
  lucideCalendarDays,
  lucideClapperboard,
  lucideQuote,
  lucideAlignLeft,
} from '@ng-icons/lucide';
import { TranslocoDirective } from '@jsverse/transloco';
import type { HintModel } from '../../../domain/models/hint.model';
import { HintType } from '../../../domain/values/hint-type';
import { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@shared/localization/supported-locale';
import { LanguageTags } from '@shared/ui/language-tags/language-tags';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { ActionMenu } from '@shared/ui/action-menu/action-menu';
import { MediaImage } from '@shared/ui/media-image/media-image';
@Component({
  selector: 'app-hint-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, LanguageTags, IconButton, ActionMenu, MediaImage],
  providers: [
    provideIcons({
      lucideCoins,
      lucideEllipsis,
      lucideUserRound,
      lucideCalendarDays,
      lucideClapperboard,
      lucideQuote,
      lucideAlignLeft,
    }),
  ],
  templateUrl: './hint-card.html',
})
export class HintCard {
  readonly hint = input.required<HintModel>();
  readonly locale = input.required<SupportedLocale>();
  readonly disabled = input(false);
  readonly manage = output<HintEditorMode>();
  protected selectAction(value: string): void {
    if (
      !this.disabled() &&
      (value === HintEditorMode.Edit ||
        value === HintEditorMode.Delete ||
        (value === HintEditorMode.Translate && this.canTranslate()))
    )
      this.manage.emit(value);
  }
  protected readonly visual = computed(() => isImageHint(this.hint().type));
  protected readonly modes = HintEditorMode;
  protected readonly info = computed(() =>
    this.hint().info.find((info) => info.language === this.locale()),
  );
  protected readonly languages = computed(() => this.hint().info.map((info) => info.language));
  protected readonly canTranslate = computed(() =>
    SUPPORTED_LOCALES.some((locale) => !this.languages().includes(locale)),
  );
  protected readonly icon = computed(
    () =>
      ({
        [HintType.Actor]: 'lucideUserRound',
        [HintType.Year]: 'lucideCalendarDays',
        [HintType.Frame]: 'lucideClapperboard',
        [HintType.Quote]: 'lucideQuote',
        [HintType.Plot]: 'lucideAlignLeft',
      })[this.hint().type],
  );
}
