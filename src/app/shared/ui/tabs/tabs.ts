import { ChangeDetectionStrategy, Component, contentChildren, input, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent } from '@spartan-ng/helm/tabs';
import { TabContent } from './tab-content';
@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent, NgTemplateOutlet],
  template: ` <div hlmTabs [tab]="value()" (tabActivated)="value.set($event)" class="space-y-5">
    <div hlmTabsList class="w-full sm:w-auto" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab.value()) {
        <button type="button" [hlmTabsTrigger]="tab.value()">{{ tab.label() }}</button>
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
