import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Shimmer } from '@shared/ui/shimmer/shimmer';
@Component({
  selector: 'app-audio-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shimmer],
  host: { class: 'block', 'aria-hidden': 'true' },
  template: ` <div
    class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 rounded-lg border bg-card p-5 sm:gap-x-8 sm:px-8"
  >
    <app-shimmer class="row-span-2 aspect-square size-11 self-center sm:size-15 rounded-full" />
    <div class="min-w-0 space-y-2">
      <app-shimmer class="h-5 w-3/4 max-w-44" /><app-shimmer class="h-4 w-1/2 max-w-32" />
    </div>
    <app-shimmer class="size-8 justify-self-center rounded-md" />
    <div class="col-start-2 row-start-2 flex h-8 items-center gap-2">
      <app-shimmer class="h-3 w-8" /><app-shimmer class="h-1.5 flex-1 rounded-full" /><app-shimmer
        class="h-3 w-8"
      />
    </div>
    <app-shimmer class="col-start-3 row-start-2 size-8 justify-self-center rounded-md" />
  </div>`,
})
export class AudioCardSkeleton {}
