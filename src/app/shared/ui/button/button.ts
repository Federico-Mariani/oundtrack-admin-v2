import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ButtonType } from '@shared/types/button-type';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import type { ButtonSize } from '@shared/types/button-size';
import type { ButtonVariant } from '@shared/types/button-variant';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmSpinner],
})
export class Button {
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>();
  readonly size = input<ButtonSize>();
  readonly form = input<string>();
  readonly text = input.required<string>();
}
