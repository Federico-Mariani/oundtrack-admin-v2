import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@shared/ui/sidebar/sidebar';
import { HlmSidebarInset, HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { Select } from '@shared/ui/select/select';
import type { SelectItem } from '@shared/interfaces/select-item';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSunMedium } from '@ng-icons/lucide';
import { LanguageService } from '@app/core/i18n/language.service';
import { isSupportedLanguage } from '@app/core/i18n/supported-language';
import { ThemeService } from '@app/core/theme/theme.service';
import { AuthFacade, AuthNavigationService } from '@features/auth';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideSunMedium, lucideMoon })],
  imports: [RouterOutlet, Sidebar, HlmSidebarInset, HlmSidebarTrigger, Select, IconButton],
})
export class DefaultLayout {
  private readonly language = inject(LanguageService);
  private readonly theme = inject(ThemeService);
  private readonly authFacade = inject(AuthFacade);
  private readonly authNavigation = inject(AuthNavigationService);

  protected readonly currentUser = this.authFacade.data.user;

  protected readonly languagesAvailable: SelectItem[] = this.language.options.map((option) => ({
    label: option.label,
    value: option.code,
  }));
  protected readonly activeLanguage = computed<string>(() => this.language.activeLanguage());
  protected readonly themeIcon = computed<string>(() =>
    this.theme.isDark() ? 'lucideSunMedium' : 'lucideMoon',
  );

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected changeLanguage(language: string): void {
    if (isSupportedLanguage(language)) {
      this.language.change(language);
    }
  }

  protected logout(): void {
    this.authFacade.actions.logout();
    void this.authNavigation.goToLogin();
  }
}
