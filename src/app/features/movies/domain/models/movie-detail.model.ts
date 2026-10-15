import type { MovieModel } from './movie.model';
import type { MovieGameCategoryModel } from './movie-game-category.model';
import type { MovieSoundtrackModel } from './movie-soundtrack.model';
export interface MovieDetailModel extends MovieModel {
  readonly gameCategories: readonly MovieGameCategoryModel[];
  readonly soundtracks: readonly MovieSoundtrackModel[];
}
