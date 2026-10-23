import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { Subject } from 'rxjs';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import { CatalogDetailNavigation } from './catalog-detail-navigation';
@Component({
  selector: 'app-navigation-detail-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class Detail implements ModalContent<{ id: string }, void> {
  readonly params = { id: 'test' };
  readonly ref = inject<BrnDialogRef<void>>(BrnDialogRef);
}
@Component({
  selector: 'app-catalog-navigation-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class Host {
  readonly navigation = new CatalogDetailNavigation();
}
describe('URL-driven detail lifecycle', () => {
  it('reopens the URL entity, handles back/forward and ignores late close callbacks', () => {
    const responses: Array<Subject<void>> = [];
    const close = vi.fn();
    const open = vi.fn(() => {
      const response = new Subject<void>();
      responses.push(response);
      return { closed$: response.asObservable(), forceClose: close };
    });
    TestBed.configureTestingModule({ providers: [{ provide: ModalService, useValue: { open } }] });
    const fixture = TestBed.createComponent(Host),
      navigation = fixture.componentInstance.navigation,
      closed = vi.fn();
    navigation.synchronize('first', Detail, closed);
    navigation.synchronize('first', Detail, closed);
    expect(open).toHaveBeenCalledTimes(1);
    navigation.synchronize('second', Detail, closed);
    expect(close).toHaveBeenCalledTimes(1);
    responses[0]?.next();
    expect(closed).not.toHaveBeenCalled();
    navigation.synchronize(null, Detail, closed);
    expect(close).toHaveBeenCalledTimes(2);
    responses[1]?.next();
    expect(closed).not.toHaveBeenCalled();
    navigation.synchronize('first', Detail, closed);
    expect(open).toHaveBeenCalledTimes(3);
    responses[2]?.next();
    expect(closed).toHaveBeenCalledWith('first');
    navigation.synchronize('second', Detail, closed);
    fixture.destroy();
    responses[3]?.next();
    expect(closed).toHaveBeenCalledTimes(1);
  });
});
