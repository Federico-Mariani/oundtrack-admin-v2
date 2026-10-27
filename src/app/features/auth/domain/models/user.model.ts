import type { Id } from '@shared/types/id';
import type { UserProfileModel } from './user-profile.model';

export interface UserModel {
  readonly id: Id;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly profile: UserProfileModel;
}
