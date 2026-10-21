import type { GenreInfoResponseDto } from '@app/core/catalog/api/genre-info-response.dto';

export interface GenreResponseDto {
  readonly id: string;
  readonly info: Array<GenreInfoResponseDto>;
}
