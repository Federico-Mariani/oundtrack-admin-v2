import { Directive, inject, input, TemplateRef } from '@angular/core';
@Directive({ selector: 'ng-template[appTabContent]' })
export class TabContent {
  readonly value = input.required<string>({ alias: 'appTabContent' });
  readonly label = input.required<string>();
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
