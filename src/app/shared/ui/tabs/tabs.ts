import { ChangeDetectionStrategy, Component, contentChildren, input, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';
import { TabContent } from './tab-content';

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent, NgTemplateOutlet],
  templateUrl: './tabs.html',
})
export class Tabs {
  readonly value = model.required<string>();
  readonly label = input.required<string>();
  protected readonly tabs = contentChildren(TabContent);
}
