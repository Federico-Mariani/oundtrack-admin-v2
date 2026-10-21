import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from '@shared/ui/button/button';
import { FormRoot } from '@angular/forms/signals';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardContent, HlmCardFooter } from '@spartan-ng/helm/card';
import { NumberInput } from '@shared/ui/number-input/number-input';
import { SelectField } from '@shared/ui/select-field/select-field';
import { TextInput } from '@shared/ui/text-input/text-input';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { toSupportedLocale } from '@app/core/i18n/language/language-locale.mapper';
import { AppFormController } from '@app/core/forms/app-form-controller';
import { AppFormField } from '@app/core/forms/app-form-field';
import { RequiredInputRule } from '@app/core/forms/rules/required-input-rule';
import { NonBlankInputRule } from '@app/core/forms/rules/non-blank-input-rule';
import { IntegerInputRule } from '@app/core/forms/rules/integer-input-rule';
import { isSupportedLocale } from '@shared/localization/supported-locale';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import { TV_SERIES_NAVIGATION } from '../../routing/tv-series.navigation';
import type { CreateTvSeriesForm } from '../../forms/create-tv-series.form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-one-tv-series-page',
  templateUrl: './create-one-tv-series-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    TranslocoDirective,
    Button,
    FormRoot,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardFooter,
    NumberInput,
    SelectField,
    TextInput,
    RouterLink,
  ],
})
export class CreateOneTvSeriesPage {
  private readonly tvSeriesFacade = inject(TvSeriesFacade);
  private readonly language = inject(LanguageService);
  protected readonly tvSeriesLink = TV_SERIES_NAVIGATION.root();
  protected readonly busy = this.tvSeriesFacade.requests.create.isLoading;
  protected readonly created = this.tvSeriesFacade.requests.create.isSuccess;
  protected readonly languages = this.language.options.map((option) => ({
    label: option.label,
    value: toSupportedLocale(option.code),
  }));
  private readonly fieldErrors = computed(
    () => this.tvSeriesFacade.requests.create.error()?.fieldErrors,
  );
  protected readonly controller = new AppFormController<CreateTvSeriesForm>(
    [
      new AppFormField('title', [new RequiredInputRule(), new NonBlankInputRule()]),
      new AppFormField('year', [new RequiredInputRule(), new IntegerInputRule(1, 9998)]),
      new AppFormField('language', [new RequiredInputRule()]),
    ],
    () => {
      this.create();
    },
    this.fieldErrors,
  );

  constructor() {
    this.tvSeriesFacade.actions.resetCreateTvSeries();
    this.controller.form().reset(this.emptyForm());
    effect(() => {
      if (this.created()) {
        untracked(() => {
          this.controller.form().reset(this.emptyForm());
        });
      }
    });
  }

  protected reset(): void {
    if (this.busy()) {
      return;
    }
    this.tvSeriesFacade.actions.resetCreateTvSeries();
    this.controller.form().reset(this.emptyForm());
  }

  private emptyForm(): CreateTvSeriesForm {
    return { title: '', year: '', language: this.language.activeLocale() };
  }

  private create(): void {
    if (this.busy()) {
      return;
    }
    const model = this.controller.model();
    if (!isSupportedLocale(model.language)) {
      return;
    }
    this.tvSeriesFacade.actions.createTvSeries({
      title: model.title.trim(),
      year: Number(model.year),
      language: model.language,
    });
  }
}
