import { DEFAULT_SIDEBAR_GROUPS } from './default-sidebar.config';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../ui/sidebar/sidebar';
import { HlmSidebarInset, HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { Select } from '@shared/ui/select/select';
import type { SelectItem } from '@shared/interfaces/select-item';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { provideIcons } from '@ng-icons/core';
import {
  lucideFilm,
  lucideHome,
  lucideMoon,
  lucideSunMedium,
  lucideTags,
  lucideTv,
} from '@ng-icons/lucide';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { isSupportedLanguage } from '@app/core/i18n/language/supported-language';
import { ThemeService } from '@app/core/theme/theme.service';
import { AuthFacade, AuthNavigationService } from '@features/auth';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({ lucideSunMedium, lucideMoon, lucideHome, lucideFilm, lucideTags, lucideTv }),
  ],
  imports: [RouterOutlet, Sidebar, HlmSidebarInset, HlmSidebarTrigger, Select, IconButton],
})
export class DefaultLayout {
  private readonly language = inject(LanguageService);
  private readonly theme = inject(ThemeService);
  private readonly authFacade = inject(AuthFacade);
  private readonly authNavigation = inject(AuthNavigationService);

  protected readonly loggingOut = signal(false);

  protected readonly sidebarGroups = DEFAULT_SIDEBAR_GROUPS;

  protected readonly currentUser = this.authFacade.data.user;

  protected readonly languagesAvailable: Array<SelectItem> = this.language.options.map(
    (option) => ({
      label: option.label,
      value: option.code,
    }),
  );
  protected readonly activeLanguage = computed<string>(() => this.language.activeLanguage());
  protected readonly themeIcon = computed<string>(() =>
    this.theme.isDark() ? 'lucideSunMedium' : 'lucideMoon',
  );

  constructor() {
    effect(() => {
      if (!this.authFacade.data.isAuthenticated()) {
        untracked(() => {
          if (!this.loggingOut()) {
            void this.authNavigation.goToLogin();
          }
        });
      }
    });
  }

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected changeLanguage(language: string): void {
    if (isSupportedLanguage(language)) {
      this.language.change(language);
    }
  }

  protected async logout(): Promise<void> {
    if (this.loggingOut()) {
      return;
    }
    this.loggingOut.set(true);
    try {
      this.authFacade.actions.logout();
      await this.authNavigation.goToLogin();
    } finally {
      this.loggingOut.set(false);
    }
  }
}
