import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { FormRoot } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { TranslocoDirective } from '@jsverse/transloco';
import { AppFormController } from '@app/core/forms/app-form-controller';
import { AppFormField } from '@app/core/forms/app-form-field';
import { RequiredInputRule } from '@app/core/forms/rules/required-input-rule';
import { isSupportedLocale, type SupportedLocale } from '@shared/localization/supported-locale';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { Button } from '@shared/ui/button/button';
import { SelectField } from '@shared/ui/select-field/select-field';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import type { CreateMovieInfoForm } from '../../forms/create-movie-info.form';
import type { CreateMovieInfoModalParams } from './create-movie-info-modal-params';

@Component({
  selector: 'app-create-movie-info-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, FormRoot, SelectField, Button],
  template: `
    <app-modal-frame
      *transloco="let t; prefix: 'movies.createInfo'"
      [title]="t('title')"
      [description]="t('description')"
      [closeDisabled]="busy()"
    >
      <form
        [formRoot]="controller.form"
        id="create-movie-info-form"
        class="space-y-4"
        [attr.aria-busy]="busy()"
      >
        <app-select-field
          [formField]="controller.form.language"
          [label]="t('language')"
          [items]="languages"
          [disabled]="busy()"
        />
        @if (error(); as error) {
          <p role="alert" class="text-sm text-destructive">{{ t('errors.' + error.code) }}</p>
        }
        @if (busy()) {
          <p role="status" class="text-sm text-muted-foreground">{{ t('pending') }}</p>
        }
        <div class="flex justify-end gap-2 pt-3">
          <app-button
            variant="ghost"
            [text]="t('cancel')"
            [disabled]="busy()"
            (click)="ref.close()"
          />
          <app-button
            type="submit"
            [text]="t('submit')"
            [loading]="busy()"
            [disabled]="busy() || !controller.form().valid()"
          />
        </div>
      </form>
    </app-modal-frame>
  `,
})
export class CreateMovieInfoModal implements ModalContent<
  CreateMovieInfoModalParams,
  SupportedLocale
> {
  readonly params = injectBrnDialogContext<{ params: CreateMovieInfoModalParams }>().params;
  readonly ref = inject<BrnDialogRef<SupportedLocale>>(BrnDialogRef);
  private readonly facade = inject(MoviesFacade);
  protected readonly busy = this.facade.requests.createInfo.isLoading;
  protected readonly error = this.facade.requests.createInfo.error;
  protected readonly languages = this.params.languages.map((value) => ({
    value,
    label: value === 'it-IT' ? 'Italiano' : 'English',
  }));
  private readonly fieldErrors = computed(() => this.error()?.fieldErrors);
  protected readonly controller = new AppFormController<CreateMovieInfoForm>(
    [new AppFormField('language', [new RequiredInputRule()])],
    () => {
      this.submit();
    },
    this.fieldErrors,
  );
  constructor() {
    this.facade.actions.resetCreateInfo();
    this.controller.form().reset({ language: '' });
    effect(() => {
      if (this.facade.requests.createInfo.isSuccess()) {
        untracked(() => {
          const language = this.controller.model().language;
          if (isSupportedLocale(language)) {
            this.ref.close(language);
          }
        });
      }
    });
    inject(DestroyRef).onDestroy(() => {
      this.facade.actions.resetCreateInfo();
    });
  }
  private submit(): void {
    const language = this.controller.model().language;
    if (this.busy() || !isSupportedLocale(language) || !this.params.languages.includes(language)) {
      return;
    }
    this.facade.actions.createInfo({ id: this.params.id, language });
  }
}
