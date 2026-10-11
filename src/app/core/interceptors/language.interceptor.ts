import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@environments/environment';
import { LanguageService } from '../i18n/language/language.service';
import { toSupportedLocale } from '../i18n/language/language-locale.mapper';

export const languageInterceptor: HttpInterceptorFn = (request, next) => {
  const languageService = inject(LanguageService);

  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  const locale = toSupportedLocale(languageService.activeLanguage());

  return next(
    request.clone({
      setHeaders: {
        'Accept-Language': locale,
      },
    }),
  );
};
