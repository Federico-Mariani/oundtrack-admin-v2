import type { Id } from '@shared/types/id';

/** `data` payload returned by `GET /movies`. */
export interface MovieResponseDto {
    readonly id: Id;
}
