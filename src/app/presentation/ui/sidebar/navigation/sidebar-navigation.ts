import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import type { SidebarGroup } from '../sidebar-group';

@Component({
  selector: 'app-sidebar-navigation',
  templateUrl: './sidebar-navigation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
    NgIcon,
    HlmSidebarImports,
    HlmCollapsibleImports,
  ],
  providers: [provideIcons({ lucideChevronRight })],
})
export class SidebarNavigation {
  private readonly sidebar = inject(HlmSidebarService);

  readonly groups = input.required<readonly SidebarGroup[]>();

  protected closeMobile(event: MouseEvent): void {
    if (
      event.button === 0 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      this.sidebar.setOpenMobile(false);
    }
  }
}
