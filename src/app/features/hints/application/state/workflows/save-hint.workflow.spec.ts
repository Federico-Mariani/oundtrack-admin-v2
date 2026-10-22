import { lastValueFrom, of, throwError, toArray, tap } from 'rxjs';
import { saveHintWorkflow } from './save-hint.workflow';
import { HintSaveEventKind } from './hint-save-event.workflow';
import { initialHintsState } from '../hints.state';
import { HintEditorMode } from '../../workflows/hint-editor.mode';
import type { SaveHintCommand } from '../../commands/save-hint.command';
import type { HintsRepositoryPort } from '../../ports/hints-repository.port';
import type { HintModel } from '../../../domain/models/hint.model';
import { HintType } from '../../../domain/values/hint-type';
import { createHintCommand, hintFixture } from '../../../testing/hint.fixtures';
import { SupportedLocale, SUPPORTED_LOCALES } from '@shared/localization/supported-locale';
import { RequestErrorCode } from '@shared/state/request/request-error';

describe('Saving hint languages', () => {
  let hint: HintModel;
  let calls: Array<SaveHintCommand>;
  let repository: HintsRepositoryPort;
  beforeEach(() => {
    hint = hintFixture();
    calls = [];
    repository = {
      getByOwner: vi.fn(() => of([hint])),
      save: vi.fn((command: SaveHintCommand) => {
        calls.push(command);
        if (command.mode === HintEditorMode.Create) {
          hint = {
            ...hint,
            type: command.type,
            info: [
              {
                id: command.language,
                language: command.language,
                text: command.text ?? null,
                image: null,
              },
            ],
          };
        } else if (
          command.mode === HintEditorMode.Translate ||
          command.mode === HintEditorMode.Edit
        ) {
          hint = {
            ...hint,
            info: [
              ...hint.info.filter((info) => info.language !== command.language),
              {
                id: command.language,
                language: command.language,
                text: command.text ?? null,
                image: hint.info[0]?.image ?? null,
              },
            ],
          };
        }
        return of(hint);
      }),
      uploadImage: vi.fn(() => of(30, 100)),
      completeImage: vi.fn(() => {
        hint = {
          ...hint,
          info: hint.info.map((info) => ({ ...info, image: 'https://image.test/shared.png' })),
        };
        return of(hint);
      }),
    };
  });
  it.each([HintType.Actor, HintType.Frame])(
    'creates every locale and uploads only once for %s',
    async (type) => {
      const command: SaveHintCommand = {
        ...createHintCommand(),
        mode: HintEditorMode.Create,
        type,
        language: SupportedLocale.Italian,
        languages: SUPPORTED_LOCALES,
        text: undefined,
        fileKey: 'image',
      };
      const events = await lastValueFrom(
        saveHintWorkflow(repository, command, initialHintsState).pipe(toArray()),
      );
      expect(calls.map((call) => call.mode)).toEqual([
        HintEditorMode.Create,
        HintEditorMode.Translate,
      ]);
      expect(calls[1]).not.toHaveProperty('text');
      expect(repository.uploadImage).toHaveBeenCalledTimes(1);
      expect(repository.completeImage).toHaveBeenCalledTimes(1);
      expect(hint.info.map((info) => info.language)).toEqual([...SUPPORTED_LOCALES]);
      expect(hint.info.every((info) => info.image === 'https://image.test/shared.png')).toBe(true);
      expect(events.filter((event) => event.kind === HintSaveEventKind.Completed)).toHaveLength(1);
    },
  );
  it('creates one hint and saves the same text in both locales', async () => {
    await lastValueFrom(
      saveHintWorkflow(
        repository,
        { ...createHintCommand(), languages: SUPPORTED_LOCALES },
        initialHintsState,
      ),
    );
    expect(calls).toHaveLength(2);
    expect(hint.info.map((info) => info.text?.trim())).toEqual(['A clue', 'A clue']);
    expect(repository.uploadImage).not.toHaveBeenCalled();
  });
  it('reconciles a translation committed before a lost response without duplicating it', async () => {
    const command = { ...createHintCommand(), languages: SUPPORTED_LOCALES };
    const originalSave = repository.save;
    const checkpoint: { hint: HintModel | null } = { hint: null };
    repository.save = (mutation) => {
      const result = originalSave(mutation);
      return mutation.mode === HintEditorMode.Translate
        ? throwError(() => ({ code: RequestErrorCode.Network }))
        : result;
    };
    await expect(
      lastValueFrom(
        saveHintWorkflow(repository, command, initialHintsState).pipe(
          tap((event) => {
            if (event.kind === HintSaveEventKind.Localized) checkpoint.hint = event.hint;
          }),
        ),
      ),
    ).rejects.toEqual({ code: RequestErrorCode.Network });
    expect(checkpoint.hint?.info).toHaveLength(1);
    repository.save = originalSave;
    await lastValueFrom(
      saveHintWorkflow(repository, command, {
        ...initialHintsState,
        preparedHint: checkpoint.hint,
      }),
    );
    expect(repository.getByOwner).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
    expect(hint.info).toHaveLength(2);
  });
  it('updates only selected existing translations', async () => {
    hint = {
      ...hint,
      info: [
        ...hint.info,
        { ...hint.info[0], id: 'italian', language: SupportedLocale.Italian, text: 'Originale' },
      ],
    };
    await lastValueFrom(
      saveHintWorkflow(
        repository,
        {
          mode: HintEditorMode.Edit,
          owner: createHintCommand().owner,
          hintId: hint.id,
          type: hint.type,
          language: SupportedLocale.English,
          languages: [SupportedLocale.English],
          text: 'Updated',
        },
        { ...initialHintsState, hints: [hint] },
      ),
    );
    expect(hint.info.find((info) => info.language === SupportedLocale.Italian)?.text).toBe(
      'Originale',
    );
    expect(hint.info.find((info) => info.language === SupportedLocale.English)?.text).toBe(
      'Updated',
    );
    expect(calls).toHaveLength(1);
  });
});
