import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {type ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners,} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {routes} from './app.routes';
import {authTokenInterceptor, provideAuth} from '@features/auth';
import {provideAppTransloco} from '@app/core/i18n/transloco.providers';
import {provideAppTheme} from '@app/core/theme/theme.providers';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideStore(),
        provideStoreDevtools({logOnly: !isDevMode()}),
        provideAppTransloco(),
        provideAppTheme(),
        provideAuth(),

    ],
};
