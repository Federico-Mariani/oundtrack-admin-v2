import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { ModalService } from './modal.service';
import type { ModalContent } from './modal-content';

interface TestParams {
  readonly name: string;
}
const FEATURE_LABEL = new InjectionToken<string>('feature label');

@Component({
  selector: 'app-test-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<button (click)="ref.close(params.name)">{{ label }}: {{ params.name }}</button>',
})
class TestModal implements ModalContent<TestParams, string> {
  readonly params = injectBrnDialogContext<{ params: TestParams }>().params;
  readonly ref = inject<BrnDialogRef<string>>(BrnDialogRef);
  readonly label = inject(FEATURE_LABEL);
}

@Component({
  selector: 'app-test-modal-owner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FEATURE_LABEL, useValue: 'Feature' }],
  template: '',
})
class TestModalOwner {
  readonly viewContainerRef = inject(ViewContainerRef);
}

describe('ModalService', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [TestModal, TestModalOwner] });
    const fixture = TestBed.createComponent(TestModalOwner);
    return {
      fixture,
      service: TestBed.inject(ModalService),
      options: { viewContainerRef: fixture.componentInstance.viewContainerRef },
    };
  }

  it('uses Spartan content and preserves caller providers, parameters and close results', async () => {
    const { fixture, service, options } = setup();
    const ref = service.open(TestModal, { name: 'First' }, options);
    const closed = vi.fn();
    ref.closed$.subscribe(closed);
    await fixture.whenStable();
    const button = document.querySelector<HTMLButtonElement>(
      'hlm-dialog-content app-test-modal button',
    )!;
    expect(button.textContent).toBe('Feature: First');
    button.click();
    await vi.waitFor(() => {
      expect(closed).toHaveBeenCalledExactlyOnceWith('First');
    });
    expect(document.querySelector('hlm-dialog-content')).toBeNull();
    fixture.destroy();
  });

  it('immediately disposes the Spartan overlay when the calling component is destroyed', () => {
    const { fixture, service, options } = setup();
    const ref = service.open(TestModal, { name: 'Scoped' }, options);
    const closed = vi.fn();
    ref.closed$.subscribe(closed);
    fixture.destroy();
    expect(closed).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(document.querySelector('hlm-dialog-content')).toBeNull();
  });

  it('isolates parameters and results between openings', async () => {
    const { fixture, service, options } = setup();
    const first = service.open(TestModal, { name: 'First' }, options);
    const second = service.open(TestModal, { name: 'Second' }, options);
    const firstClosed = vi.fn();
    const secondClosed = vi.fn();
    first.closed$.subscribe(firstClosed);
    second.closed$.subscribe(secondClosed);
    await fixture.whenStable();
    expect(first.id).not.toBe(second.id);
    expect(
      Array.from(
        document.querySelectorAll('app-test-modal button'),
        (button) => button.textContent,
      ),
    ).toEqual(['Feature: First', 'Feature: Second']);
    second.close();
    await vi.waitFor(() => {
      expect(secondClosed).toHaveBeenCalledExactlyOnceWith(undefined);
    });
    expect(firstClosed).not.toHaveBeenCalled();
    first.close('saved');
    await vi.waitFor(() => {
      expect(firstClosed).toHaveBeenCalledExactlyOnceWith('saved');
    });
    fixture.destroy();
  });
});
