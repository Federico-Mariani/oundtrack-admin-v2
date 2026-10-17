import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress';
@Component({
  selector: 'app-upload-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmProgress, HlmProgressIndicator],
  host: { class: 'block space-y-3' },
  template: `
    <div class="flex items-center justify-between gap-4 text-sm">
      <span role="status" class="font-medium">{{ label() }}</span>
      @if (value() !== null) {
        <span class="tabular-nums text-muted-foreground">{{ value() }}%</span>
      }
    </div>
    <hlm-progress class="h-2" [value]="value()" [attr.aria-label]="label()"
      ><hlm-progress-indicator
    /></hlm-progress>
  `,
})
export class UploadProgress {
  readonly label = input.required<string>();
  readonly value = input<number | null>(null);
}
