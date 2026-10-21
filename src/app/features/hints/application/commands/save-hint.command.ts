import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { HintOwner } from '../../domain/values/hint-owner';
import type { HintType } from '../../domain/values/hint-type';
import type { HintEditorMode } from '../workflows/hint-editor.mode';
interface HintContent {
  readonly language: SupportedLocale;
  readonly text: string;
}
export type SaveHintCommand = { readonly owner: HintOwner } & (
  | ({
      readonly mode: typeof HintEditorMode.Create;
      readonly type: HintType;
      readonly cost: number;
    } & HintContent)
  | ({
      readonly mode: typeof HintEditorMode.Edit;
      readonly hintId: string;
      readonly type: HintType;
      readonly cost: number;
    } & HintContent)
  | ({ readonly mode: typeof HintEditorMode.Translate; readonly hintId: string } & HintContent)
  | { readonly mode: typeof HintEditorMode.Delete; readonly hintId: string }
);
