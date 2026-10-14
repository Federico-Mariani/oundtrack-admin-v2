import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Shimmer } from '@shared/ui/shimmer/shimmer';

@Component({
  selector: 'app-movie-detail-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shimmer],
  host: { class: 'block', 'aria-hidden': 'true' },
  template: `
    <div class="relative h-52 sm:h-72">
      <app-shimmer class="h-full w-full rounded-none" />
      <div class="absolute inset-0 bg-gradient-to-t from-popover to-transparent"></div>
      <app-shimmer class="absolute left-3 top-3 h-10 w-28 rounded-xl" />
    </div>
    <div class="relative -mt-20 space-y-7 px-5 pb-6 sm:-mt-24 sm:px-8 sm:pb-8">
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
      <div class="grid gap-5 border-b pb-6 sm:grid-cols-2">
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
      <div class="space-y-4">
        <app-shimmer class="h-5 w-40" />
        @for (row of [0, 1]; track row) {
          <div class="rounded-2xl border bg-card p-5">
            <div class="flex items-center gap-4">
              <app-shimmer class="size-12 shrink-0 rounded-full" />
              <div class="flex-1 space-y-2">
                <app-shimmer class="h-5 w-3/4 max-w-44" /><app-shimmer class="h-4 w-1/2 max-w-32" />
              </div>
              <app-shimmer class="size-6 rounded-full" />
            </div>
            <div class="mt-5 space-y-3 sm:ml-16">
              <app-shimmer class="h-1.5 w-full rounded-full" />
              <div class="flex justify-between">
                <app-shimmer class="h-3 w-16" /><app-shimmer class="h-3 w-24" />
              </div>
            </div>
          </div>
        }
      </div>
      <div class="space-y-5 border-t pt-7">
        <app-shimmer class="h-5 w-44" />
        <div class="grid gap-8 lg:grid-cols-2">
          @for (group of [0, 1]; track group) {
            <div class="space-y-4">
              <app-shimmer class="h-4 w-32" />
              @for (field of [0, 1, 2, 3]; track field) {
                <div class="flex justify-between gap-4 border-b pb-3">
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
export class MovieDetailSkeleton {}
