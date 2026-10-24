import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco } from '@jsverse/transloco';
import { of } from 'rxjs';
import { CategoryEditor } from './category-editor';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';
import { ModalService } from '@shared/ui/modal/modal.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { RequestErrorCode, type RequestError } from '@shared/state/request/request-error';
import type { GameCategoryModel } from '../../../domain/models/game-category.model';
import type { SaveCategoryCommand } from '../../../application/commands/save-category.command';
import { CategorySavePhase } from '../../../application/workflows/category-save.phase';
class EmptyLoader {
  getTranslation() {
    return of({});
  }
}
@Component({
  selector: 'app-category-editor-test-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class Host {
  readonly container = inject(ViewContainerRef);
}
describe('Category editor', () => {
  it('validates names, retains fields after failure and reports success only after the full save', async () => {
    const busy = signal(false),
      success = signal(false),
      error = signal<RequestError | null>(null),
      saveId = signal<string | null>(null),
      prepared = signal<GameCategoryModel | null>(null);
    const save = vi.fn((_session: string, id: string, _command: SaveCategoryCommand) => {
      saveId.set(id);
      busy.set(true);
    });
    const notifications = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en'], defaultLang: 'en', prodMode: true },
          loader: EmptyLoader,
        }),
        { provide: NotificationService, useValue: notifications },
        {
          provide: GameCategoriesFacade,
          useValue: {
            actions: {
              openEditor: vi.fn(),
              closeEditor: vi.fn(),
              saveCategory: save,
              getAll: vi.fn(),
            },
            data: {
              saveId,
              preparedCategory: prepared,
              categoryPhase: signal(CategorySavePhase.Names),
              categoryProgress: signal(null),
              categoryCreationUncertain: signal(false),
            },
            requests: { save: { isLoading: busy, isSuccess: success, error } },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(Host),
      ref = TestBed.inject(ModalService).open(
        CategoryEditor,
        {},
        { viewContainerRef: fixture.componentInstance.container, disableClose: true },
      ),
      closed = vi.fn();
    ref.closed$.subscribe(closed);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(document.querySelector('app-category-editor form')).not.toBeNull();
    });
    const root = document.querySelector<HTMLElement>('app-category-editor')!,
      form = root.querySelector('form')!,
      inputs = root.querySelectorAll<HTMLInputElement>('input[type="text"]');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    expect(root.textContent).toContain('Enter at least one name');
    for (const [index, value] of ['Film', 'Movies'].entries()) {
      inputs[index].value = value;
      inputs[index].dispatchEvent(new Event('input', { bubbles: true }));
    }
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
      categoryId: undefined,
      names: [
        { language: 'it-IT', name: 'Film' },
        { language: 'en-US', name: 'Movies' },
      ],
      fileKey: undefined,
    });
    expect(inputs[0].disabled).toBe(true);
    expect(closed).not.toHaveBeenCalled();
    busy.set(false);
    error.set({ code: RequestErrorCode.Conflict });
    fixture.detectChanges();
    expect(inputs[0].value).toBe('Film');
    expect(inputs[0].disabled).toBe(false);
    expect(notifications.error).toHaveBeenCalledOnce();
    expect(closed).not.toHaveBeenCalled();
    error.set(null);
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    busy.set(false);
    success.set(true);
    fixture.detectChanges();
    await vi.waitFor(() => {
      expect(closed).toHaveBeenCalledWith(true);
    });
    expect(notifications.success).toHaveBeenCalledOnce();
    fixture.destroy();
  });
});
