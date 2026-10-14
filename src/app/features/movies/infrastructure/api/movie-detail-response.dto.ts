import type { MovieResponseDto } from './movie-response.dto';
import type { MovieGenreResponseDto } from './movie-genre-response.dto';
export interface MovieDetailResponseDto extends MovieResponseDto {
  readonly gameCategories: readonly (MovieGenreResponseDto & { readonly image: string | null })[];
  readonly soundtracks: readonly {
    readonly id: string;
    readonly tracks: readonly {
      readonly id: string;
      readonly externalId: string;
      readonly path: string | null;
      readonly name: string;
      readonly artist: string;
      readonly language: string;
    }[];
  }[];
}
