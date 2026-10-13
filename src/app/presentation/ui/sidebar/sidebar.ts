import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideLogOut } from '@ng-icons/lucide';
import {
  HlmDropdownMenu,
  HlmDropdownMenuGroup,
  HlmDropdownMenuItem,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { Avatar } from '@shared/ui/avatar/avatar';
import type { SidebarUser } from '@shared/interfaces/sidebar-user';
import type { SidebarGroup } from './sidebar-group';
import { SidebarNavigation } from './navigation/sidebar-navigation';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { sidebarTranslationsLoader } from '../../i18n/sidebar-translations.loader';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Scope is private to this view: projected routed pages keep their feature scope.
  viewProviders: [provideTranslocoScope({ scope: 'sidebar', loader: sidebarTranslationsLoader })],
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideLogOut,
    }),
  ],
  imports: [
    HlmSidebarImports,
    NgIcon,
    HlmDropdownMenuTrigger,
    HlmDropdownMenuItem,
    HlmDropdownMenuGroup,
    HlmDropdownMenuSeparator,
    HlmDropdownMenu,
    Avatar,
    SidebarNavigation,
    TranslocoDirective,
  ],
})
export class Sidebar {
  readonly groups = input.required<readonly SidebarGroup[]>();
  readonly user = input<SidebarUser | null>(null);
  readonly logout = output();
}
