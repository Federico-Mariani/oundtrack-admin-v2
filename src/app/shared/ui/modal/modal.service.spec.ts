import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Injector,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
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
  readonly params = inject<TestParams>(DIALOG_DATA);
  readonly ref = inject<DialogRef<string>>(DialogRef);
  readonly label = inject(FEATURE_LABEL);
}

describe('ModalService', () => {
  it('opens a component with typed parameters and the caller injector, and returns its close result', async () => {
    TestBed.configureTestingModule({ imports: [TestModal] });
    const injector = Injector.create({
      parent: TestBed.inject(Injector),
      providers: [{ provide: FEATURE_LABEL, useValue: 'Feature' }],
    });
    const service = TestBed.inject(ModalService);
    const ref = service.open(TestModal, { name: 'First' }, { injector });
    const closed = vi.fn();
    ref.closed.subscribe(closed);
    await TestBed.inject(ApplicationRef).whenStable();
    const button = document.querySelector<HTMLButtonElement>('app-test-modal button')!;
    expect(button.textContent).toBe('Feature: First');
    button.click();
    expect(closed).toHaveBeenCalledExactlyOnceWith('First');
    expect(document.querySelector('app-test-modal')).toBeNull();
    injector.destroy();
  });

  it('closes and releases the overlay when the calling injector is destroyed', () => {
    TestBed.configureTestingModule({ imports: [TestModal] });
    const injector = Injector.create({
      parent: TestBed.inject(Injector),
      providers: [{ provide: FEATURE_LABEL, useValue: 'Feature' }],
    });
    const ref = TestBed.inject(ModalService).open(TestModal, { name: 'Scoped' }, { injector });
    const closed = vi.fn();
    ref.closed.subscribe(closed);
    injector.destroy();
    expect(closed).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(document.querySelector('app-test-modal')).toBeNull();
  });

  it('isolates parameters and results for separate openings and dismisses without a result', () => {
    TestBed.configureTestingModule({
      imports: [TestModal],
      providers: [{ provide: FEATURE_LABEL, useValue: 'Feature' }],
    });
    const service = TestBed.inject(ModalService);
    const injector = TestBed.inject(Injector);
    const first = service.open(TestModal, { name: 'First' }, { injector });
    const second = service.open(TestModal, { name: 'Second' }, { injector });
    const firstClosed = vi.fn();
    const secondClosed = vi.fn();
    first.closed.subscribe(firstClosed);
    second.closed.subscribe(secondClosed);
    expect(first.id).not.toBe(second.id);
    expect(first.config.data).toEqual({ name: 'First' });
    expect(second.config.data).toEqual({ name: 'Second' });
    second.close();
    expect(secondClosed).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(firstClosed).not.toHaveBeenCalled();
    first.close('saved');
    expect(firstClosed).toHaveBeenCalledExactlyOnceWith('saved');
  });
});
