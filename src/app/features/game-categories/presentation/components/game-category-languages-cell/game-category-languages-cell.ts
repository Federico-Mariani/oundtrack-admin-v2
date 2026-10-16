import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SupportedLocale } from '@shared/localization/supported-locale';

@Component({
  selector: 'app-game-category-languages-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-category-languages-cell.html',
})
export class GameCategoryLanguagesCell {
  readonly languages = input.required<ReadonlyArray<SupportedLocale>>();
}
