import { TestBed } from '@angular/core/testing';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import { NotificationService } from '@app/core/notifications/notification.service';
import { AuthFeedbackService } from './auth-feedback.service';
import enErrors from '../i18n/en/errors.json';
import itErrors from '../i18n/it/errors.json';
import type { RequestErrorCode } from '@shared/state/request/request-error';

class EmptyLoader {
  getTranslation() {
    return of({});
  }
}
describe('Auth feedback translations', () => {
  it('resolves every login error in English and Italian, including runtime language changes', () => {
    const notify = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: { error: notify } },
        provideTransloco({
          config: {
            availableLangs: ['en', 'it'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: EmptyLoader,
        }),
      ],
    });
    const translations = TestBed.inject(TranslocoService);
    translations.setTranslation({ auth: { errors: enErrors } }, 'en');
    translations.setTranslation({ auth: { errors: itErrors } }, 'it');
    const feedback = TestBed.inject(AuthFeedbackService);
    const codes: Array<RequestErrorCode> = [
      'network',
      'bad-request',
      'unauthorized',
      'forbidden',
      'not-found',
      'conflict',
      'validation',
      'server',
      'unknown',
    ];
    for (const language of ['en', 'it', 'en']) {
      translations.setActiveLang(language);
      const messages = language === 'it' ? itErrors.login : enErrors.login;
      for (const code of codes) {
        feedback.loginFailed({ code });
        expect(notify).toHaveBeenLastCalledWith(messages[code]);
      }
    }
  });
});
