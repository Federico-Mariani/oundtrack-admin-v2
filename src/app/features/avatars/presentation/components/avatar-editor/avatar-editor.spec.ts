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
import { AvatarEditor } from './avatar-editor';
import { AvatarsFacade } from '../../../application/state/facades/avatars.facade';
import { ImageSelection } from '@app/core/uploads/image-selection';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { RequestError } from '@shared/state/request/request-error';
import type { ImageSelectionControl } from '@shared/ui/image-upload-field/image-selection-control';
class Loader {
  getTranslation() {
    return of({});
  }
}
@Component({
  selector: 'app-avatar-test-host',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Host {
  readonly container = inject(ViewContainerRef);
}
describe('Avatar editor', () => {
  it('requires an image, preserves failed work, locks dismissal while saving and closes only on success', async () => {
    const busy = signal(false),
      success = signal(false),
      error = signal<RequestError | null>(null),
      requestId = signal<string | null>(null);
    const selection = {
      fileKey: signal<string | null>(null),
      preview: signal<string | null>(null),
      name: signal('avatar.png'),
      size: signal('1'),
      checking: signal(false),
      invalid: signal(false),
      multiple: signal(false),
      choose: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn(),
    } satisfies ImageSelectionControl;
    const save = vi.fn((_session: string, id: string) => {
        requestId.set(id);
        busy.set(true);
      }),
      notifications = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en'], defaultLang: 'en', prodMode: true },
          loader: Loader,
        }),
        { provide: NotificationService, useValue: notifications },
        {
          provide: AvatarsFacade,
          useValue: {
            data: { requestId, phase: signal('upload'), progress: signal(50) },
            requests: { save: { isLoading: busy, isSuccess: success, error } },
            actions: { openEditor: vi.fn(), closeEditor: vi.fn(), save },
          },
        },
      ],
    });
    TestBed.overrideComponent(AvatarEditor, {
      add: { providers: [{ provide: ImageSelection, useValue: selection }] },
    });
    const fixture = TestBed.createComponent(Host),
      ref = TestBed.inject(ModalService).open(
        AvatarEditor,
        {
          avatar: {
            id: 'avatar',
            path: 'https://media.test/avatar.png',
            createdAt: 0,
            updatedAt: 0,
          },
        },
        { viewContainerRef: fixture.componentInstance.container, disableClose: true },
      ),
      closed = vi.fn();
    ref.closed$.subscribe(closed);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(document.querySelector('app-avatar-editor form')).not.toBeNull();
    });
    const root = document.querySelector('app-avatar-editor')!,
      form = root.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    selection.fileKey.set('local-file');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('app-file-dropzone')).toBeNull();
    expect(root.querySelector('app-file-attachment')).not.toBeNull();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(save).toHaveBeenCalledWith(expect.any(String), expect.any(String), {
      avatarId: 'avatar',
      fileKey: 'local-file',
    });
    expect(root.querySelector<HTMLButtonElement>('app-icon-button button')?.disabled).toBe(true);
    expect(closed).not.toHaveBeenCalled();
    busy.set(false);
    error.set({ code: 'network' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(selection.fileKey()).toBe('local-file');
    expect(notifications.error).toHaveBeenCalledOnce();
    error.set(null);
    success.set(true);
    fixture.detectChanges();
    await vi.waitFor(() => {
      expect(closed).toHaveBeenCalledWith(true);
    });
    expect(notifications.success).toHaveBeenCalledOnce();
    fixture.destroy();
  });
});
