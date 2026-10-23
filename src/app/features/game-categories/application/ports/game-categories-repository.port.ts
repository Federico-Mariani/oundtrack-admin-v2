import type { SetOwnerCategoriesCommand } from '../commands/set-owner-categories.command';
import type { Observable } from 'rxjs';
import type { GameCategoryModel } from '../../domain/models/game-category.model';

export interface GameCategoriesRepositoryPort {
  setForOwner(command: SetOwnerCategoriesCommand): Observable<void>;
  getAll(): Observable<Array<GameCategoryModel>>;
}
