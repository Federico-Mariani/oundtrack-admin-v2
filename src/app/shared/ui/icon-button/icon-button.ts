import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import type {ButtonType} from '@shared/types/button-type';
import {HlmButton} from '@spartan-ng/helm/button';
import type {ButtonSize} from '@shared/types/button-size';
import type {ButtonVariant} from '@shared/types/button-variant';
import {NgIcon} from "@ng-icons/core";

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HlmButton, NgIcon],
})
export class IconButton {
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>('outline');
  readonly size = input<ButtonSize>();
  readonly icon = input.required<string>();
}
