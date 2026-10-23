import { AudioCardSkeleton } from './audio-card-skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Shimmer } from '@shared/ui/shimmer/shimmer';

@Component({
  selector: 'app-media-detail-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shimmer, AudioCardSkeleton],
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <div class="relative h-64 sm:h-96">
      <app-shimmer class="h-full w-full rounded-none" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-popover from-0% via-popover/65 via-55% to-popover/20"
      ></div>
    </div>
    <div class="relative -mt-20 space-y-8 px-5 pb-8 sm:-mt-24 sm:px-8 sm:pb-8">
      <div class="flex items-end gap-4 sm:gap-6">
        <app-shimmer
          class="aspect-[2/3] w-28 shrink-0 rounded-xl border-4 border-popover shadow-xl sm:w-40"
        />
        <div class="min-w-0 flex-1 space-y-3 pb-1">
          <app-shimmer class="h-8 w-full max-w-80 sm:h-10" /><app-shimmer
            class="h-4 w-3/4 max-w-48"
          />
        </div>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        @for (group of [0, 1]; track group) {
          <div class="space-y-3">
            <app-shimmer class="h-3 w-24" />
            <div class="flex gap-2">
              <app-shimmer class="h-8 w-24 rounded-full" /><app-shimmer
                class="h-8 w-20 rounded-full"
              />
            </div>
          </div>
        }
      </div>
      <div>
        <div class="flex h-12 items-center justify-around rounded-t-lg border">
          <app-shimmer class="h-4 w-24" /><app-shimmer class="h-4 w-24" />
        </div>
        <div class="space-y-4 rounded-b-lg border border-t-0 p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <app-shimmer class="h-6 w-40" /><app-shimmer class="h-9 w-36" />
          </div>
          @for (row of [0, 1]; track row) {
            <app-audio-card-skeleton />
          }
        </div>
      </div>
      <div class="space-y-4">
        <app-shimmer class="h-5 w-44" />
        <div class="grid gap-8 lg:grid-cols-2">
          @for (group of [0, 1]; track group) {
            <div class="space-y-4">
              <app-shimmer class="h-4 w-32" />
              @for (field of group === 0 ? [0, 1, 2, 3] : [0, 1]; track field) {
                <div class="flex justify-between gap-3 pb-3">
                  <app-shimmer class="h-3 w-20" /><app-shimmer class="h-4 w-1/2" />
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MediaDetailSkeleton {}
