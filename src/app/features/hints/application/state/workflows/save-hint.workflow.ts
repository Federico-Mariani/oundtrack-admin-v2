import {
  concat,
  concatMap,
  defer,
  from,
  map,
  of,
  switchMap,
  throwError,
  type Observable,
} from 'rxjs';
import type { SaveHintCommand } from '../../commands/save-hint.command';
import type { HintsRepositoryPort } from '../../ports/hints-repository.port';
import { HintEditorMode } from '../../workflows/hint-editor.mode';
import type { HintsState } from '../hints.state';
import type { HintModel } from '../../../domain/models/hint.model';
import { isImageHint } from '../../../domain/values/hint-image-policy';
import { HintSaveEventKind as Kind, type HintSaveEvent } from './hint-save-event.workflow';
import { saveHintContentWorkflow } from './save-hint-content.workflow';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { isSupportedLocale, SUPPORTED_LOCALES } from '@shared/localization/supported-locale';

export function saveHintWorkflow(
  repository: HintsRepositoryPort,
  command: SaveHintCommand,
  state: HintsState,
): Observable<HintSaveEvent> {
  if (command.mode === HintEditorMode.Delete || !command.languages)
    return saveHintContentWorkflow(repository, command, state);
  const languages = [...new Set(command.languages)];
  if (!languages.length || !languages.every(isSupportedLocale))
    return throwError(() => ({ code: RequestErrorCode.Validation }));
  const existing =
    command.mode === HintEditorMode.Create
      ? state.preparedHint
      : (state.preparedHint ?? state.hints.find((hint) => hint.id === command.hintId));
  const initial: Observable<HintModel | null | undefined> = state.preparedHint
    ? repository
        .getByOwner(command.owner.id)
        .pipe(map((hints) => hints.find((hint) => hint.id === state.preparedHint?.id)))
    : existing
      ? of(existing)
      : command.mode === HintEditorMode.Create
        ? repository.save({ ...command, language: languages[0] ?? command.language })
        : of(null);
  return initial.pipe(
    switchMap((hint) => {
      if (!hint) return throwError(() => ({ code: RequestErrorCode.NotFound }));
      let current = hint;
      const targets = isImageHint(hint.type) ? SUPPORTED_LOCALES : languages;
      const text =
        command.mode === HintEditorMode.Image || isImageHint(hint.type)
          ? undefined
          : command.text?.trim();
      const updates = from(targets).pipe(
        concatMap((language) =>
          defer(() => {
            const info = current.info.find((item) => item.language === language);
            if (
              info &&
              (isImageHint(current.type) ||
                command.mode !== HintEditorMode.Edit ||
                info.text === text)
            )
              return of(current);
            const mutation: SaveHintCommand = info
              ? {
                  mode: HintEditorMode.Edit,
                  owner: command.owner,
                  hintId: current.id,
                  type: current.type,
                  language,
                  text,
                }
              : {
                  mode: HintEditorMode.Translate,
                  owner: command.owner,
                  hintId: current.id,
                  language,
                  ...(text !== undefined ? { text } : {}),
                };
            return repository.save(mutation).pipe(
              map((updated) => {
                if (!updated) throw new Error('Missing saved hint');
                current = updated;
                return updated;
              }),
            );
          }),
        ),
        map((updated): HintSaveEvent => ({ kind: Kind.Localized, hint: updated })),
      );
      return concat(
        of<HintSaveEvent>({ kind: Kind.Localized, hint }),
        updates,
        defer(() =>
          saveHintContentWorkflow(repository, command, { ...state, preparedHint: current }),
        ),
      );
    }),
  );
}
