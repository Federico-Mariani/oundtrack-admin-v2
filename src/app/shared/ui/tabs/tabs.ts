import { ChangeDetectionStrategy, Component, contentChildren, input, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent } from '@spartan-ng/helm/tabs';
import { TabContent } from './tab-content';
@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent, NgTemplateOutlet],
  template: ` <div hlmTabs [tab]="value()" (tabActivated)="value.set($event)" class="gap-0">
    <div
      hlmTabsList
      variant="line"
      class="relative z-10 -mb-px h-12 w-full gap-0 rounded-none p-0"
      [attr.aria-label]="label()"
    >
      @for (tab of tabs(); track tab.value()) {
        <button
          type="button"
          class="min-w-0 flex-1 rounded-none px-4 py-3 group-data-[orientation=horizontal]/tabs:after:bottom-0"
          [hlmTabsTrigger]="tab.value()"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    @for (tab of tabs(); track tab.value()) {
      <div class="rounded-b-lg border border-border p-4 sm:p-6" [hlmTabsContent]="tab.value()">
        <ng-container [ngTemplateOutlet]="tab.template" />
      </div>
    }
  </div>`,
})
export class Tabs {
  readonly value = model.required<string>();
  readonly label = input.required<string>();
  protected readonly tabs = contentChildren(TabContent);
}
