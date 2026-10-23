import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCoins, lucideEllipsis, lucideEye } from '@ng-icons/lucide';
import { TranslocoDirective } from '@jsverse/transloco';
import type { HintModel } from '../../../domain/models/hint.model';
import { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import { SUPPORTED_LOCALES } from '@shared/localization/supported-locale';
import { LanguageTags } from '@shared/ui/language-tags/language-tags';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { ActionMenu } from '@shared/ui/action-menu/action-menu';
import { HintIcon } from '../hint-icon/hint-icon';
import { Button } from '@shared/ui/button/button';
@Component({
  selector: 'app-hint-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, LanguageTags, IconButton, ActionMenu, HintIcon, Button],
  providers: [provideIcons({ lucideCoins, lucideEllipsis, lucideEye })],
  templateUrl: './hint-card.html',
})
export class HintCard {
  readonly hint = input.required<HintModel>();
  readonly disabled = input(false);
  readonly preview = output();
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
  protected readonly modes = HintEditorMode;
  protected readonly languages = computed(() => this.hint().info.map((info) => info.language));
  protected readonly canTranslate = computed(() =>
    SUPPORTED_LOCALES.some((locale) => !this.languages().includes(locale)),
  );
}
