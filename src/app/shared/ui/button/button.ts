import { ChangeDetectionStrategy, Component, input, type TemplateRef } from '@angular/core';
import type { ButtonType } from '@shared/types/button-type';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon } from '@ng-icons/core';
import { HlmDropdownMenuTrigger } from '@spartan-ng/helm/dropdown-menu';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import type { ButtonSize } from '@shared/types/button-size';
import type { ButtonVariant } from '@shared/types/button-variant';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmSpinner, NgIcon, HlmDropdownMenuTrigger],
})
export class Button {
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>();
  readonly size = input<ButtonSize>();
  readonly form = input<string>();
  readonly text = input('');
  readonly icon = input<string>();
  readonly ariaLabel = input<string>();
  readonly title = input<string>();
  readonly buttonClass = input('');
  readonly menu = input<TemplateRef<unknown> | null>(null);
}
