import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { FormRoot } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { Button } from '@shared/ui/button/button';
import { TextInput } from '@shared/ui/text-input/text-input';
import { NumberInput } from '@shared/ui/number-input/number-input';
import { SelectField } from '@shared/ui/select-field/select-field';
import { AppFormController } from '@app/core/forms/app-form-controller';
import { AppFormField } from '@app/core/forms/app-form-field';
import { RequiredInputRule } from '@app/core/forms/rules/required-input-rule';
import { IntegerInputRule } from '@app/core/forms/rules/integer-input-rule';
import { NonBlankInputRule } from '@app/core/forms/rules/non-blank-input-rule';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { toSupportedLocale } from '@app/core/i18n/language/language-locale.mapper';
import { isSupportedLocale } from '@shared/localization/supported-locale';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import type { CreateMovieFormModel } from '../../models/create-movie-form.model';
import { MOVIES_NAVIGATION } from '../../routing/movies.navigation';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-create-one-movie-page',
  templateUrl: './create-one-movie-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormRoot,
    RouterLink,
    TranslocoDirective,
    HlmCardImports,
    HlmButton,
    Button,
    TextInput,
    NumberInput,
    SelectField,
    NgIcon
  ],
})
export class CreateOneMoviePage {
  private readonly movies = inject(MoviesFacade);
  private readonly language = inject(LanguageService);
  protected readonly moviesLink = MOVIES_NAVIGATION.root();
  protected readonly busy = this.movies.loadingStatuses.isCreatingMovie;
  protected readonly created = this.movies.data.movieCreated;
  protected readonly languages = this.language.options.map((option) => ({
    label: option.label,
    value: toSupportedLocale(option.code),
  }));
  private readonly fieldErrors = computed(
    () => this.movies.errorStatuses.createMovie()?.fieldErrors,
  );
  protected readonly controller = new AppFormController<CreateMovieFormModel>(
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
    this.movies.actions.resetCreateMovie();
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
    this.movies.actions.resetCreateMovie();
    this.controller.form().reset(this.emptyForm());
  }

  private emptyForm(): CreateMovieFormModel {
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
    this.movies.actions.createMovie({
      title: model.title.trim(),
      year: Number(model.year),
      language: model.language,
    });
  }
}
