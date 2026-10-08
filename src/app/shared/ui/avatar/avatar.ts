import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {HlmAvatar, HlmAvatarImage} from "@spartan-ng/helm/avatar";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        HlmAvatarImage,
        HlmAvatar,
    ]
})
export class Avatar {
    readonly source = input.required<string>();
    readonly alt = input.required<string>();
}
