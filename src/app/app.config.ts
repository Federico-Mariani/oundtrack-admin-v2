import { provideHints } from '@features/hints';
import { provideSoundtracks } from '@features/soundtracks';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  type ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { authTokenInterceptor, provideAuth } from '@features/auth';
import { provideAppTransloco } from '@app/core/i18n/transloco/transloco.providers';
import { provideAppTheme } from '@app/core/theme/theme.providers';
import { provideMovies } from '@features/movies';
import { languageInterceptor } from '@app/core/interceptors/language.interceptor';
import { provideGameCategories } from '@features/game-categories';
import { provideTvSeries } from '@features/tv-series';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor, languageInterceptor])),
    provideStore(),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideAppTransloco(),
    provideAppTheme(),
    provideAuth(),
    provideMovies(),
    provideSoundtracks(),
    provideHints(),
    provideTvSeries(),
    provideGameCategories(),
  ],
};
