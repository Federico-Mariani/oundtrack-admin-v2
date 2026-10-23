import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco } from '@jsverse/transloco';
import { of } from 'rxjs';
import { ModalService } from '@shared/ui/modal/modal.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';
import { OwnerCategoriesModal } from './owner-categories-modal';
import { GameCategoryOwnerType } from '../../../domain/values/game-category-owner';
import { RequestErrorCode, type RequestError } from '@shared/state/request/request-error';
class EmptyLoader {
  getTranslation() {
    return of({});
  }
}
@Component({
  selector: 'app-category-editor-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class Host {
  readonly container = inject(ViewContainerRef);
}
describe('Category selection editor', () => {
  it('searches locally, preserves selections on failure, supports removing all, and closes only after success', async () => {
    const busy = signal(false),
      success = signal(false),
      error = signal<RequestError | null>(null),
      request = signal<string | null>(null);
    const assign = vi.fn((_session: string, id: string) => {
      request.set(id);
      busy.set(true);
    });
    const getAll = vi.fn(),
      notifications = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en'], defaultLang: 'en', prodMode: true },
          loader: EmptyLoader,
        }),
        { provide: LanguageService, useValue: { activeLocale: signal('en-US') } },
        { provide: NotificationService, useValue: notifications },
        {
          provide: GameCategoriesFacade,
          useValue: {
            actions: { openAssignment: vi.fn(), closeAssignment: vi.fn(), getAll, assign },
            data: {
              loaded: signal(true),
              assignmentId: request,
              categories: signal([
                { id: 'one', image: null, info: { 'en-US': { id: 'info1', name: 'Movies' } } },
                { id: 'two', image: null, info: { 'en-US': { id: 'info2', name: 'Space' } } },
              ]),
            },
            requests: {
              getAll: { isLoading: signal(false), error: signal(null) },
              assignment: { isLoading: busy, isSuccess: success, error },
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(Host);
    const ref = TestBed.inject(ModalService).open(
      OwnerCategoriesModal,
      { owner: { id: 'movie', type: GameCategoryOwnerType.Movie }, categoryIds: ['one'] },
      { viewContainerRef: fixture.componentInstance.container, disableClose: true },
    );
    const closed = vi.fn();
    ref.closed$.subscribe(closed);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(document.querySelector('app-owner-categories-modal input')).not.toBeNull();
    });
    const root = document.querySelector<HTMLElement>('app-owner-categories-modal')!;
    const search = root.querySelector<HTMLInputElement>('input')!;
    const button = (text: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((item) =>
        item.textContent.includes(text),
      )!;
    expect(button('Save categories').disabled).toBe(true);
    search.value = 'Space';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelectorAll('app-checkbox-choice')).toHaveLength(1);
    root.querySelector<HTMLButtonElement>('app-checkbox-choice button')!.click();
    fixture.detectChanges();
    button('Save categories').click();
    fixture.detectChanges();
    expect(assign).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
      owner: { id: 'movie', type: GameCategoryOwnerType.Movie },
      categoryIds: ['one', 'two'],
    });
    busy.set(false);
    error.set({ code: RequestErrorCode.Network });
    fixture.detectChanges();
    expect(closed).not.toHaveBeenCalled();
    expect(notifications.error).toHaveBeenCalledOnce();
    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    for (const checkbox of root.querySelectorAll<HTMLButtonElement>('app-checkbox-choice button')) {
      expect(checkbox.getAttribute('aria-checked')).toBe('true');
      checkbox.click();
      fixture.detectChanges();
    }
    error.set(null);
    button('Save categories').click();
    fixture.detectChanges();
    expect(assign).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ categoryIds: [] }),
    );
    busy.set(false);
    success.set(true);
    fixture.detectChanges();
    await vi.waitFor(() => {
      expect(closed).toHaveBeenCalledWith(true);
    });
    expect(notifications.success).toHaveBeenCalledOnce();
    expect(getAll).toHaveBeenCalledOnce();
    fixture.destroy();
  });
});
