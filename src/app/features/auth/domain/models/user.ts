import type { Id } from '@shared/types/id';

export interface User {
  readonly id: Id;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}
