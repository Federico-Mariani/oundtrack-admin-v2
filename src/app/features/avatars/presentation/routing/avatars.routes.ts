import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { avatarsTranslationsLoader } from '../i18n/avatars-translations.loader';
export const AVATARS_ROUTES: Routes = [
  {
    path: '',
    providers: [provideTranslocoScope({ scope: 'avatars', loader: avatarsTranslationsLoader })],
    loadComponent: () => import('../pages/avatars-page/avatars-page').then((m) => m.AvatarsPage),
  },
];
