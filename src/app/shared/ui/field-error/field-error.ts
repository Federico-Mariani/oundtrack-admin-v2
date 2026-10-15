import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ValidationError } from '@angular/forms/signals';
import { HlmFieldError } from '@spartan-ng/helm/field';
import { TranslocoDirective } from '@jsverse/transloco';

/**
 * Renders a field's validation errors and localizes them in one place, so
 * individual inputs stay i18n-free.
 *
 * Client-side rules (`core/forms`) carry only a semantic `kind` (`required`,
 * `email`, ...) and no message, so each one is mapped to the global
 * `validation.<kind>` translation owned by the app shell (`core/i18n`). Errors
 * that already carry a resolved message (e.g. server-originated field errors)
 * are shown verbatim.
 */
@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.html',
  imports: [HlmFieldError, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-1' },
})
export class FieldError {
  readonly errors = input<ReadonlyArray<ValidationError>>([]);
}
