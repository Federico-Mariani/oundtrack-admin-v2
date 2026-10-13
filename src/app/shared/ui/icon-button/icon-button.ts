import { ChangeDetectionStrategy, Component, input, type TemplateRef } from '@angular/core';
import type { ButtonType } from '@shared/types/button-type';
import { HlmButton } from '@spartan-ng/helm/button';
import type { ButtonSize } from '@shared/types/button-size';
import type { ButtonVariant } from '@shared/types/button-variant';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmDropdownMenuTrigger } from '@spartan-ng/helm/dropdown-menu';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, NgIcon, HlmSpinner, HlmDropdownMenuTrigger],
})
export class IconButton {
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>('outline');
  readonly size = input<ButtonSize>('icon');
  readonly icon = input.required<string>();
  readonly ariaLabel = input<string>();
  readonly title = input<string>();
  readonly menu = input<TemplateRef<unknown> | null>(null);
}
