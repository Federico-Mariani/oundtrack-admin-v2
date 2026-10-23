import type { HintOwner } from '../../../domain/values/hint-owner';
import type { HintModel } from '../../../domain/models/hint.model';
import type { HintType } from '../../../domain/values/hint-type';
import type { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface HintEditorParams {
  readonly sessionId: string;
  readonly owner: HintOwner;
  readonly mode: HintEditorMode;
  readonly locale: SupportedLocale;
  readonly hint?: HintModel;
  readonly availableTypes: ReadonlyArray<HintType>;
}
