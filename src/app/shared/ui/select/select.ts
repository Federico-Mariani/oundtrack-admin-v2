import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {
    HlmSelect,
    HlmSelectContent,
    HlmSelectGroup,
    HlmSelectItem,
    HlmSelectPortal,
    HlmSelectTrigger,
    HlmSelectValue
} from "@spartan-ng/helm/select";
import type {SelectItem} from "@shared/interfaces/select-item";

@Component({
    selector: 'app-select',
    templateUrl: './select.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        HlmSelect,
        HlmSelectTrigger,
        HlmSelectValue,
        HlmSelectContent,
        HlmSelectPortal,
        HlmSelectGroup,
        HlmSelectItem
    ]
})
export class Select {
    readonly items = input.required<SelectItem[]>();
    readonly placeholder = input<string>('');
    readonly value = input<string>();
    readonly valueChange = output<string>();

    protected onValueChange(value: unknown): void {
        if (typeof value === 'string') {
            this.valueChange.emit(value);
        }
    }
}
