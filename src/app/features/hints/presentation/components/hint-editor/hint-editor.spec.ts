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
import { HintEditor } from './hint-editor';
import { HintsFacade } from '../../../application/state/facades/hints.facade';
import type { SaveHintCommand } from '../../../application/commands/save-hint.command';
import { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import { HintType } from '../../../domain/values/hint-type';
import { createHintCommand, hintFixture } from '../../../testing/hint.fixtures';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalService } from '@shared/ui/modal/modal.service';
import { RequestErrorCode, type RequestError } from '@shared/state/request/request-error';
import { SupportedLocale } from '@shared/localization/supported-locale';

class EmptyTranslationLoader {
  getTranslation() {
    return of({});
  }
}
@Component({
  selector: 'app-hint-editor-test-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class HintEditorTestHost {
  readonly container = inject(ViewContainerRef);
}

describe('Hint editor', () => {
  const busy = signal(false),
    success = signal(false),
    error = signal<RequestError | null>(null),
    saveId = signal<string | null>(null);
  const save = vi.fn((_session: string, requestId: string, _command: SaveHintCommand) => {
    saveId.set(requestId);
    busy.set(true);
  });
  const notifications = { success: vi.fn(), error: vi.fn() };
  beforeEach(() => {
    busy.set(false);
    success.set(false);
    error.set(null);
    saveId.set(null);
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
          loader: EmptyTranslationLoader,
        }),
        { provide: NotificationService, useValue: notifications },
        {
          provide: HintsFacade,
          useValue: {
            data: { saveId },
            requests: { save: { isLoading: busy, isSuccess: success, error } },
            actions: { resetSave: vi.fn(), save },
          },
        },
      ],
    });
  });
  afterEach(() => TestBed.resetTestingModule());
  async function open(mode: HintEditorMode = HintEditorMode.Create) {
    const fixture = TestBed.createComponent(HintEditorTestHost);
    const ref = TestBed.inject(ModalService).open(
      HintEditor,
      {
        sessionId: 'panel',
        owner: createHintCommand().owner,
        mode,
        locale: SupportedLocale.English,
        availableTypes: [HintType.Plot],
        hint: mode === HintEditorMode.Create ? undefined : hintFixture(),
      },
      { viewContainerRef: fixture.componentInstance.container, disableClose: true },
    );
    const closed = vi.fn();
    ref.closed$.subscribe(closed);
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(document.querySelector('app-hint-editor form')).not.toBeNull();
    });
    const form = document.querySelector<HTMLFormElement>('app-hint-editor form')!;
    const text = form.querySelector<HTMLTextAreaElement>('textarea')!;
    const cost = form.querySelector<HTMLInputElement>('input')!;
    return { fixture, closed, form, text, cost };
  }
  function fill(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  it('requires meaningful content and a nonnegative integer cost, accepting zero', async () => {
    const { fixture, form, text, cost } = await open();
    fill(text, '   ');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    fill(text, ' A clue ');
    fill(cost, '1.5');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    fill(cost, '0');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).toHaveBeenCalledWith(
      'panel',
      expect.any(String),
      expect.objectContaining({ mode: HintEditorMode.Create, text: 'A clue', cost: 0 }),
    );
    expect(text.disabled).toBe(true);
  });
  it('retains entered content and shows an error when edit is unavailable', async () => {
    const { fixture, form, text, closed } = await open(HintEditorMode.Edit);
    fill(text, 'Changed clue');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    busy.set(false);
    error.set({ code: RequestErrorCode.NotFound, status: 404 });
    fixture.detectChanges();
    expect(text.value).toBe('Changed clue');
    expect(closed).not.toHaveBeenCalled();
    expect(form.textContent).toContain('Editing is not available yet');
    expect(notifications.error).toHaveBeenCalledTimes(1);
  });
  it('closes and notifies only after the request succeeds', async () => {
    const { fixture, form, text, closed } = await open();
    fill(text, 'Clue');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(closed).not.toHaveBeenCalled();
    success.set(true);
    busy.set(false);
    fixture.detectChanges();
    await vi.waitFor(() => {
      expect(closed).toHaveBeenCalledWith(true);
    });
    expect(notifications.success).toHaveBeenCalledTimes(1);
  });
  it('offers only missing languages for a translation', async () => {
    const { fixture, form, text } = await open(HintEditorMode.Translate);
    fill(text, 'Indizio');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).toHaveBeenCalledWith(
      'panel',
      expect.any(String),
      expect.objectContaining({
        mode: HintEditorMode.Translate,
        hintId: 'hint',
        language: SupportedLocale.Italian,
      }),
    );
  });
});
