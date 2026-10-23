import { concat, defer, map, of, switchMap, throwError, type Observable } from 'rxjs';
import type { HintsRepositoryPort } from '../../ports/hints-repository.port';
import type { SaveHintCommand } from '../../commands/save-hint.command';
import { HintEditorMode } from '../../workflows/hint-editor.mode';
import type { HintsState } from '../hints.state';
import { HintSaveEventKind as Kind, type HintSaveEvent } from './hint-save-event.workflow';
import { isImageHint } from '../../../domain/values/hint-image-policy';
import { RequestErrorCode } from '@shared/state/request/request-error';
export function saveHintContentWorkflow(
  repository: HintsRepositoryPort,
  command: SaveHintCommand,
  state: HintsState,
): Observable<HintSaveEvent> {
  const fileKey = command.mode === HintEditorMode.Delete ? undefined : command.fileKey;
  const existing =
    command.mode === HintEditorMode.Image
      ? state.hints.find((hint) => hint.id === command.hintId)
      : null;
  if (
    fileKey &&
    (command.mode === HintEditorMode.Create ||
      command.mode === HintEditorMode.Edit ||
      command.mode === HintEditorMode.Image) &&
    !isImageHint(command.type)
  )
    return throwError(() => ({ code: RequestErrorCode.Validation }));
  const prepared = state.preparedHint ?? existing;
  const metadata = prepared
    ? of(prepared)
    : command.mode === HintEditorMode.Image
      ? throwError(() => ({ code: RequestErrorCode.NotFound }))
      : repository.save(command);
  return metadata.pipe(
    switchMap((hint) => {
      if (!fileKey || !hint) return of<HintSaveEvent>({ kind: Kind.Completed, hint });
      if (!isImageHint(hint.type)) return throwError(() => ({ code: RequestErrorCode.Validation }));
      const upload =
        state.uploadedFileKey === fileKey
          ? of<HintSaveEvent>({ kind: Kind.Uploaded, fileKey })
          : concat(
              defer(() => repository.uploadImage(hint.id, fileKey)).pipe(
                map((progress): HintSaveEvent => ({ kind: Kind.Progress, progress })),
              ),
              of<HintSaveEvent>({ kind: Kind.Uploaded, fileKey }),
            );
      return concat(
        of<HintSaveEvent>({ kind: Kind.Prepared, hint }),
        upload,
        defer(() => repository.completeImage(hint.id, fileKey)).pipe(
          map((updated): HintSaveEvent => ({ kind: Kind.Completed, hint: updated })),
        ),
      );
    }),
  );
}
