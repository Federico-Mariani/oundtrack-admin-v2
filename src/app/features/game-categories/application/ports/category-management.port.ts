import type { Observable } from 'rxjs';
import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { SupportedLocale } from '@shared/localization/supported-locale';
export interface CategoryManagementPort {
  saveName(
    id: string | undefined,
    name: string,
    language: SupportedLocale,
  ): Observable<GameCategoryModel>;
  upload(
    id: string,
    fileKey: string,
  ): Observable<{ readonly progress: number; readonly key: string }>;
  complete(id: string, fileKey: string, key: string): Observable<GameCategoryModel>;
}
