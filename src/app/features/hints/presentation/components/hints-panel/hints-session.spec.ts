import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HintsFacade } from '../../../application/state/facades/hints.facade';
import { HintOwnerType } from '../../../domain/values/hint-owner';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { HintsSession } from './hints-session';
describe('Eager hint session', () => {
  it('requests hints without mounting their tab, avoids repeat loads and closes with the detail', () => {
    const actions = { open: vi.fn(), load: vi.fn(), close: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        HintsSession,
        { provide: HintsFacade, useValue: { actions } },
        { provide: LanguageService, useValue: { activeLanguage: signal('en') } },
      ],
    });
    const session = TestBed.inject(HintsSession),
      owner = { id: 'movie', type: HintOwnerType.Movie };
    session.open(owner);
    expect(actions.load).toHaveBeenCalledWith(session.id, 'movie');
    session.open({ ...owner });
    expect(actions.load).toHaveBeenCalledTimes(1);
    session.open({ id: 'series', type: HintOwnerType.TvSeries });
    expect(actions.load).toHaveBeenCalledWith(session.id, 'series');
    TestBed.resetTestingModule();
    expect(actions.close).toHaveBeenCalledWith(session.id);
  });
});
