import type { UserModel } from '@features/auth';
import type { SidebarUser } from '@shared/interfaces/sidebar-user';

export function toSidebarUser(user: UserModel | null): SidebarUser | null {
  if (user === null) {
    return null;
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.profile.avatar?.path,
  };
}
