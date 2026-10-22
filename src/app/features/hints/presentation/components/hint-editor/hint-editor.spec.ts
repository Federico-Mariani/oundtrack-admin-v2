import { HintImageSelection } from '../../uploads/hint-image-selection';
import {
  ChangeDetectionStrategy,
  Component,
  getDebugNode,
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
            data: {
              saveId,
              icons: signal({}),
              phase: signal('idle'),
              progress: signal(null),
              preparedHint: signal(null),
              creationUncertain: signal(false),
            },
            requests: {
              icons: { error: signal(null), isLoading: signal(false) },
              save: { isLoading: busy, isSuccess: success, error },
            },
            actions: { loadIcons: vi.fn(), resetSave: vi.fn(), save },
          },
        },
      ],
    });
  });
  afterEach(() => TestBed.resetTestingModule());
  async function open(
    mode: HintEditorMode = HintEditorMode.Create,
    type: HintType = HintType.Plot,
  ) {
    const fixture = TestBed.createComponent(HintEditorTestHost);
    const ref = TestBed.inject(ModalService).open(
      HintEditor,
      {
        sessionId: 'panel',
        owner: createHintCommand().owner,
        mode,
        locale: SupportedLocale.English,
        availableTypes: [type],
        hint: mode === HintEditorMode.Create ? undefined : { ...hintFixture(), type },
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
    return { fixture, closed, form, text };
  }
  function fill(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  it('requires content and displays a fixed price without accepting a price input', async () => {
    const { fixture, form, text } = await open();
    expect(form.querySelector('input[type="number"]')).toBeNull();
    expect(form.textContent).toContain('300');
    fill(text, '   ');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).not.toHaveBeenCalled();
    fill(text, ' A clue ');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    expect(save).toHaveBeenCalledWith('panel', expect.any(String), {
      mode: HintEditorMode.Create,
      owner: createHintCommand().owner,
      type: HintType.Plot,
      language: SupportedLocale.English,
      text: 'A clue',
      languages: [SupportedLocale.English],
    });
    expect(text.disabled).toBe(true);
  });
  it('selects all languages for the same text and rejects an empty selection', async () => {
    const { fixture, form, text } = await open();
    fill(text, 'Shared clue');
    const choices = form.querySelectorAll<HTMLElement>('app-checkbox-choice button');
    expect(choices).toHaveLength(2);
    choices[1].click();
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(save).not.toHaveBeenCalled();
    const selectAll = Array.from(form.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent.includes('Select all languages'),
    )!;
    selectAll.click();
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(save).toHaveBeenCalledWith(
      'panel',
      expect.any(String),
      expect.objectContaining({
        languages: [SupportedLocale.Italian, SupportedLocale.English],
        text: 'Shared clue',
      }),
    );
  });
  it('retains entered content and shows an API error when editing fails', async () => {
    const { fixture, form, text, closed } = await open(HintEditorMode.Edit);
    fill(text, 'Changed clue');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
    busy.set(false);
    error.set({ code: RequestErrorCode.NotFound, status: 404 });
    fixture.detectChanges();
    expect(text.value).toBe('Changed clue');
    expect(closed).not.toHaveBeenCalled();
    expect(form.textContent).toContain('The operation could not be completed');
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
  it.each([HintType.Actor, HintType.Frame])(
    'replaces the text field with a single image picker for %s',
    async (type) => {
      const { fixture, form } = await open(HintEditorMode.Create, type);
      expect(form.querySelector('textarea')).toBeNull();
      expect(form.querySelector('app-checkbox-choice')).toBeNull();
      expect(form.querySelectorAll('app-select')).toHaveLength(1);
      expect(form.querySelector('app-file-dropzone')).not.toBeNull();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      expect(save).not.toHaveBeenCalled();
      const editor = document.querySelector('app-hint-editor')!;
      const selection = getDebugNode(editor)!.injector.get(HintImageSelection);
      selection.fileKey.set('file-key');
      selection.name.set('image.png');
      fixture.detectChanges();
      expect(form.querySelector('app-file-dropzone')).toBeNull();
      expect(form.querySelector('app-file-attachment')).not.toBeNull();
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();
      expect(save).toHaveBeenCalledWith('panel', expect.any(String), {
        mode: HintEditorMode.Create,
        owner: createHintCommand().owner,
        type,
        language: SupportedLocale.Italian,
        languages: [SupportedLocale.Italian, SupportedLocale.English],
        fileKey: 'file-key',
      });
    },
  );
});
