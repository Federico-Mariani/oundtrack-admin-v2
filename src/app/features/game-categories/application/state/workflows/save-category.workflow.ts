import { concat, concatMap, defer, from, map, of, throwError, type Observable } from 'rxjs';
import type { CategoryManagementPort } from '../../ports/category-management.port';
import type { SaveCategoryCommand } from '../../commands/save-category.command';
import type { GameCategoriesState } from '../game-categories.state';
import {
  CategorySaveEventKind as Kind,
  type CategorySaveEvent,
} from './category-save-event.workflow';
import { RequestErrorCode } from '@shared/state/request/request-error';
export function saveCategoryWorkflow(
  repository: CategoryManagementPort,
  command: SaveCategoryCommand,
  state: GameCategoriesState,
): Observable<CategorySaveEvent> {
  let category =
    state.preparedCategory ?? state.categories.find((item) => item.id === command.categoryId);
  if (!command.names.length || command.names.some((info) => !info.name.trim()))
    return throwError(() => ({ code: RequestErrorCode.Validation }));
  const names = from(command.names).pipe(
    concatMap((info) =>
      defer(() => {
        if (category?.info[info.language]?.name === info.name.trim()) return of(category);
        return repository.saveName(
          category?.id ?? command.categoryId,
          info.name.trim(),
          info.language,
        );
      }).pipe(
        map((saved) => {
          category = saved;
          return { kind: Kind.Prepared, category: saved } as const;
        }),
      ),
    ),
  );
  return concat(
    names,
    defer(() => {
      const current = category;
      if (!current) return throwError(() => ({ code: RequestErrorCode.NotFound }));
      const fileKey = command.fileKey;
      if (!fileKey) return of<CategorySaveEvent>({ kind: Kind.Completed, category: current });
      const upload =
        state.uploadedCategoryFile === fileKey && state.categoryUploadKey
          ? of({ progress: 100, key: state.categoryUploadKey })
          : repository.upload(current.id, fileKey);
      return upload.pipe(
        concatMap((event) =>
          event.progress < 100
            ? of<CategorySaveEvent>({ kind: Kind.Progress, progress: event.progress })
            : concat(
                of<CategorySaveEvent>({ kind: Kind.Uploaded, fileKey, key: event.key }),
                defer(() => repository.complete(current.id, fileKey, event.key)).pipe(
                  map((saved) => ({ kind: Kind.Completed, category: saved }) as const),
                ),
              ),
        ),
      );
    }),
  );
}
