import { ChangeDetectionStrategy, Component, contentChildren, input, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent } from '@spartan-ng/helm/tabs';
import { TabContent } from './tab-content';
@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent, NgTemplateOutlet],
  template: ` <div hlmTabs [tab]="value()" (tabActivated)="value.set($event)" class="space-y-5">
    <div
      hlmTabsList
      variant="line"
      class="w-full justify-start gap-5 sm:w-auto"
      [attr.aria-label]="label()"
    >
      @for (tab of tabs(); track tab.value()) {
        <button type="button" class="flex-none px-1 pb-2" [hlmTabsTrigger]="tab.value()">
          {{ tab.label() }}
        </button>
      }
    </div>
    @for (tab of tabs(); track tab.value()) {
      <div [hlmTabsContent]="tab.value()"><ng-container [ngTemplateOutlet]="tab.template" /></div>
    }
  </div>`,
})
export class Tabs {
  readonly value = model.required<string>();
  readonly label = input.required<string>();
  protected readonly tabs = contentChildren(TabContent);
}
