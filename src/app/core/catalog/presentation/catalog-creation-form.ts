import type { RequestError } from '@shared/state/request/request-error';
import type { CatalogCreationFields } from './catalog-creation-fields';
import type { CatalogCreationValues } from './catalog-creation-values';
import { ChangeDetectionStrategy, Component, computed, input, output, inject } from '@angular/core';
import { FormRoot } from '@angular/forms/signals';
import { TranslocoDirective } from '@jsverse/transloco';
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

@Component({
  selector: 'app-catalog-creation-form',
  templateUrl: './catalog-creation-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, TranslocoDirective, Button, TextInput, NumberInput, SelectField],
})
export class CatalogCreationForm {
  private readonly language = inject(LanguageService);
  readonly busy = input(false);
  readonly error = input<RequestError | null>(null);
  readonly translationPrefix = input.required<string>();
  readonly submitted = output<CatalogCreationValues>();
  readonly cancelled = output();
  protected readonly languages = this.language.options.map((option) => ({
    label: option.label,
    value: toSupportedLocale(option.code),
  }));
  private readonly fieldErrors = computed(() => this.error()?.fieldErrors);
  protected readonly controller = new AppFormController<CatalogCreationFields>(
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
    this.controller.form().reset(this.emptyForm());
  }

  private emptyForm(): CatalogCreationFields {
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
    this.submitted.emit({
      title: model.title.trim(),
      year: Number(model.year),
      language: model.language,
    });
  }
}
