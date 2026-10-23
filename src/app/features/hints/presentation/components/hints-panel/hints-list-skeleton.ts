import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Shimmer } from '@shared/ui/shimmer/shimmer';
@Component({
  selector: 'app-hints-list-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shimmer],
  host: { class: 'block space-y-2', 'aria-hidden': 'true' },
  template: `@for (item of [1, 2, 3]; track item) {
    <div class="flex items-center gap-3 rounded-lg border p-4">
      <app-shimmer class="size-10 shrink-0 rounded-lg" />
      <div class="flex-1 space-y-3">
        <app-shimmer class="h-5 w-1/3 rounded" />
        <app-shimmer class="h-4 w-24 rounded" />
      </div>
      <app-shimmer class="size-8 rounded-md" />
    </div>
  }`,
})
export class HintsListSkeleton {}
