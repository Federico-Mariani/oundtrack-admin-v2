import type { SidebarItem } from './sidebar-item';

export interface SidebarGroup {
  readonly id: string;
  readonly labelKey?: string;
  readonly items: readonly SidebarItem[];
}
