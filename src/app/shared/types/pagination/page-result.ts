import type { PageRequest } from './page-request';
export interface PageResult<T> extends PageRequest {
  readonly items: readonly T[];
  readonly total: number;
}
