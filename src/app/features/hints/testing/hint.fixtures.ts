import type { HintModel } from '../domain/models/hint.model';
import type { SaveHintCommand } from '../application/commands/save-hint.command';
import { HintType } from '../domain/values/hint-type';
import { HintOwnerType } from '../domain/values/hint-owner';
import { HintEditorMode } from '../application/workflows/hint-editor.mode';
import { SupportedLocale } from '@shared/localization/supported-locale';
export function hintFixture(): HintModel {
  return {
    id: 'hint',
    type: HintType.Plot,
    cost: 0,
    icon: 'https://media.test/signed.svg',
    info: [{ id: 'translation', language: SupportedLocale.English, text: 'A clue', image: null }],
    createdAt: 1,
    updatedAt: 2,
  };
}
export function createHintCommand(): Extract<
  SaveHintCommand,
  { mode: typeof HintEditorMode.Create }
> {
  return {
    mode: HintEditorMode.Create,
    owner: { id: 'movie', type: HintOwnerType.Movie },
    type: HintType.Plot,
    language: SupportedLocale.English,
    text: ' A clue ',
  };
}
