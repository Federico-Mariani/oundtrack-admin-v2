import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SupportedLocale } from '@shared/localization/supported-locale';

@Component({
  selector: 'app-tv-series-languages-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-1.5">
      @for (language of languages(); track language) {
        <span
          class="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground"
          [attr.aria-label]="language === 'it-IT' ? 'Italiano' : 'English'"
          [attr.title]="language === 'it-IT' ? 'Italiano' : 'English'"
        >
          {{ language === 'it-IT' ? 'IT' : 'EN' }}
        </span>
      } @empty {
        <span class="text-muted-foreground">—</span>
      }
    </div>
  `,
})
export class TvSeriesLanguagesCell {
  readonly languages = input.required<ReadonlyArray<SupportedLocale>>();
}
