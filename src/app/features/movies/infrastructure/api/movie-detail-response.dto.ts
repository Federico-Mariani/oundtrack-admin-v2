import type { MovieResponseDto } from './movie-response.dto';
import type { MovieGameCategoryResponseDto } from './movie-game-category-response.dto';
import type { MovieSoundtrackResponseDto } from './movie-soundtrack-response.dto';

export interface MovieDetailResponseDto extends MovieResponseDto {
  readonly gameCategories: ReadonlyArray<MovieGameCategoryResponseDto>;
  readonly soundtracks: ReadonlyArray<MovieSoundtrackResponseDto>;
}
