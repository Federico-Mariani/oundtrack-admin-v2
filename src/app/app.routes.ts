import type { Routes } from '@angular/router';
import { AUTH_ROUTES } from '@features/auth';
import { HOME_ROUTES } from '@features/home';

export const routes: Routes = [...AUTH_ROUTES, ...HOME_ROUTES, { path: '**', redirectTo: '' }];
