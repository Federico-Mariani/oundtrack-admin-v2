import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  HlmSidebar,
  HlmSidebarContent,
  HlmSidebarFooter,
  HlmSidebarGroup,
  HlmSidebarGroupContent,
  HlmSidebarGroupLabel,
  HlmSidebarHeader,
  HlmSidebarMenu,
  HlmSidebarMenuButton,
  HlmSidebarMenuItem,
  HlmSidebarMenuSub,
  HlmSidebarMenuSubButton,
  HlmSidebarMenuSubItem,
  HlmSidebarWrapper,
} from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideFilm,
  lucideHome,
  lucideLogOut,
} from '@ng-icons/lucide';
import {
  HlmDropdownMenu,
  HlmDropdownMenuGroup,
  HlmDropdownMenuItem,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { Avatar } from '@shared/ui/avatar/avatar';
import type { SidebarUser } from '@shared/interfaces/sidebar-user';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  HlmCollapsible,
  HlmCollapsibleContent,
  HlmCollapsibleTrigger,
} from '@spartan-ng/helm/collapsible';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideLogOut,
      lucideHome,
      lucideChevronRight,
      lucideFilm,
    }),
  ],
  imports: [
    HlmSidebarWrapper,
    HlmSidebar,
    HlmSidebarHeader,
    HlmSidebarContent,
    HlmSidebarGroup,
    HlmSidebarGroupContent,
    HlmSidebarFooter,
    HlmSidebarMenu,
    HlmSidebarMenuItem,
    HlmSidebarMenuButton,
    NgIcon,
    HlmDropdownMenuTrigger,
    HlmDropdownMenuItem,
    HlmDropdownMenuGroup,
    HlmDropdownMenuSeparator,
    HlmDropdownMenu,
    Avatar,
    RouterLink,
    HlmSidebarGroupLabel,
    HlmCollapsibleTrigger,
    HlmCollapsible,
    HlmCollapsibleContent,
    HlmSidebarMenuSub,
    HlmSidebarMenuSubItem,
    HlmSidebarMenuSubButton,
    RouterLinkActive,
    TranslocoDirective,
  ],
})
export class Sidebar {
  readonly user = input<SidebarUser | null>(null);
  readonly logout = output();
}
