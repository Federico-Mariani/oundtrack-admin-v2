import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { SoundtrackOwnerType } from '@features/soundtracks';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalService } from '@shared/ui/modal/modal.service';
import { CatalogDetail } from './catalog-detail';
import type { CatalogDetailViewModel } from './catalog-detail.view-model';

const detail: CatalogDetailViewModel = {
  id: 'catalog-record',
  externalId: 42,
  genres: [],
  gameCategories: [],
  soundtracks: [],
  createdAt: 0,
  updatedAt: 0,
  info: {
    'it-IT': {
      id: 'translation',
      title: 'Titolo',
      releaseDate: 0,
      posterUrl: '',
      backdropUrl: '',
      createdAt: 0,
      updatedAt: 0,
    },
  },
};

describe('Catalog detail interactions', () => {
  it.each([SoundtrackOwnerType.Movie, SoundtrackOwnerType.TvSeries])(
    'refreshes %s only after an audio mutation and forwards its owner',
    async (ownerType) => {
      let closed = new Subject<boolean>();
      const open = vi.fn().mockImplementation(() => ({ closed$: closed.asObservable() }));
      TestBed.configureTestingModule({
        providers: [
          { provide: LanguageService, useValue: { activeLocale: signal('en-US') } },
          { provide: NotificationService, useValue: {} },
          { provide: TranslocoService, useValue: {} },
          { provide: ModalService, useValue: { open } },
        ],
      });
      TestBed.overrideComponent(CatalogDetail, {
        set: {
          imports: [],
          template: `<button (click)="manageAudio(audioModes.Soundtrack)">Audio</button><span>{{ locale() }}:{{ info()?.title }}</span>`,
        },
      });
      const fixture = TestBed.createComponent(CatalogDetail);
      const owner = { type: ownerType, id: detail.id };
      fixture.componentRef.setInput('owner', owner);
      fixture.componentRef.setInput('translationScope', 'catalog');
      fixture.componentRef.setInput('detail', detail);
      const refresh = vi.fn();
      fixture.componentInstance.refresh.subscribe(refresh);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.textContent).toContain('it-IT:Titolo');
      element.querySelector('button')?.click();
      await vi.waitFor(() => {
        expect(open).toHaveBeenCalledTimes(1);
      });
      expect(open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ owner, locale: 'it-IT' }),
        expect.anything(),
      );
      closed.next(false);
      closed.complete();
      closed = new Subject<boolean>();
      expect(refresh).not.toHaveBeenCalled();
      element.querySelector('button')?.click();
      await vi.waitFor(() => {
        expect(open).toHaveBeenCalledTimes(2);
      });
      closed.next(true);
      expect(refresh).toHaveBeenCalledTimes(1);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(element.textContent).toContain('Titolo');
      fixture.destroy();
    },
  );
});
