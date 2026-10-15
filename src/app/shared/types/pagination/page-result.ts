import type { PageRequest } from './page-request';
export interface PageResult<T> extends PageRequest {
  readonly items: ReadonlyArray<T>;
  readonly total: number;
}
