import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SupportedLocale } from '@shared/localization/supported-locale';

@Component({
  selector: 'app-language-tags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-1.5">
      @for (language of languages(); track language) {
        <span
          class="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground"
          [attr.aria-label]="language === locales.Italian ? 'Italiano' : 'English'"
          [attr.title]="language === locales.Italian ? 'Italiano' : 'English'"
        >
          {{ language === locales.Italian ? 'IT' : 'EN' }}
        </span>
      } @empty {
        <span class="text-muted-foreground">—</span>
      }
    </div>
  `,
})
export class LanguageTags {
  protected readonly locales = SupportedLocale;
  readonly languages = input.required<ReadonlyArray<SupportedLocale>>();
}
