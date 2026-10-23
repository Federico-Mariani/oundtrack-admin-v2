import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';
import { TabContent } from './tab-content';
@Component({
  selector: 'app-tabs-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tabs, TabContent],
  template: `<app-tabs [(value)]="selected" label="Content"
    ><ng-template appTabContent="audio" label="Audio"><input aria-label="Draft" /></ng-template
    ><ng-template appTabContent="hints" label="Hints"><p>Hint list</p></ng-template></app-tabs
  >`,
})
class TabsTest {
  readonly selected = signal('audio');
}
describe('App tabs', () => {
  it('switches accessible panels while preserving mounted content', async () => {
    const fixture = TestBed.createComponent(TabsTest);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const buttons = element.querySelectorAll<HTMLButtonElement>('[role=tab]');
    const panels = element.querySelectorAll<HTMLElement>('[role=tabpanel]');
    const input = element.querySelector('input')!;
    input.value = 'Draft';
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    buttons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toBe('hints');
    expect(panels[0].hidden).toBe(true);
    expect(panels[1].hidden).toBe(false);
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    buttons[0].click();
    fixture.detectChanges();
    expect(element.querySelector('input')).toBe(input);
    expect(input.value).toBe('Draft');
  });
});
