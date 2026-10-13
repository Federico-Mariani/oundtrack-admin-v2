import type { SidebarLink } from './sidebar-link';

export interface SidebarItem extends SidebarLink {
  readonly children?: readonly SidebarLink[];
}
