import type { Observable } from 'rxjs';
import type { GameCategoryModel } from '../../domain/models/game-category.model';

export interface GameCategoriesRepositoryPort {
  getAll(): Observable<Array<GameCategoryModel>>;
}
