import type { MovieModel } from './movie.model';
import type { GameCategoryModel } from '@shared/types/catalog/game-category.model';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
export interface MovieDetailModel extends MovieModel {
  readonly gameCategories: ReadonlyArray<GameCategoryModel>;
  readonly soundtracks: ReadonlyArray<SoundtrackModel>;
}
