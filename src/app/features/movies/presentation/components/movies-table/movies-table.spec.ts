import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideTransloco,
  provideTranslocoScope,
  TranslocoDirective,
  TranslocoService,
} from '@jsverse/transloco';
import { of } from 'rxjs';
import { LanguageService } from '@app/core/i18n/language/language.service';
import type { MovieModel } from '../../../domain/models/movie.model';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';
import { MoviesTable } from './movies-table';

function movie(id: string, title: string, releaseDate: number): MovieModel {
  return {
    id,
    externalMovieId: 42,
    genres: [],
    createdAt: 0,
    updatedAt: 0,
    info: {
      'en-US': {
        id,
        title,
        releaseDate,
        posterUrl: '',
        backdropUrl: '',
        createdAt: 0,
        updatedAt: 0,
      },
    },
  };
}

@Component({
  selector: 'app-movies-table-test-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoviesTable, TranslocoDirective],
  providers: [provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader })],
  template: `<ng-container *transloco="let t; prefix: 'movies.catalog'">
    <app-movies-table [movies]="movies()" [caption]="t('title')" (copyId)="copied = $event" />
  </ng-container>`,
})
class MoviesTableTestHost {
  readonly movies = signal([
    movie('newer', 'Alpha', Date.UTC(2020, 0, 1)),
    movie('older', 'Beta', Date.UTC(2019, 11, 31)),
  ]);
  copied = '';
}

class EmptyTranslationLoader {
  getTranslation() {
    return of({});
  }
}

describe('MoviesTable integration', () => {
  it('loads translated columns, sorts dates and forwards the current row action', async () => {
    TestBed.configureTestingModule({
      imports: [MoviesTableTestHost],
      providers: [
        { provide: LanguageService, useValue: { activeLocale: signal('en-US') } },
        provideTransloco({
          config: {
            availableLangs: ['en', 'it'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: EmptyTranslationLoader,
        }),
      ],
    });
    const fixture = TestBed.createComponent(MoviesTableTestHost);
    const element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(element.querySelectorAll('tbody tr[data-row-id]')).toHaveLength(2);
    });
    expect(element.textContent).toContain('Release date');
    const dateSort = Array.from(element.querySelectorAll<HTMLButtonElement>('thead button')).find(
      (button) => button.textContent.includes('Release date'),
    )!;
    dateSort.click();
    await fixture.whenStable();
    expect(element.querySelector('tbody tr')?.getAttribute('data-row-id')).toBe('newer');
    dateSort.click();
    await fixture.whenStable();
    expect(element.querySelector('tbody tr')?.getAttribute('data-row-id')).toBe('older');
    element.querySelector<HTMLButtonElement>('button[aria-label="Actions: Beta"]')!.click();
    await fixture.whenStable();
    const copy = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')).find(
      (button) => button.textContent.includes('Copy movie ID'),
    )!;
    expect(copy).toBeDefined();
    copy.click();
    expect(fixture.componentInstance.copied).toBe('older');
    TestBed.inject(TranslocoService).setActiveLang('it');
    await vi.waitFor(() => {
      expect(element.textContent).toContain('Data di uscita');
    });
    expect(element.querySelector('tbody tr')?.getAttribute('data-row-id')).toBe('older');
  });
});
