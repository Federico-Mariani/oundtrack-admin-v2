import { Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '@app/core/i18n/language/language.service';
import { DataTable } from '@shared/ui/data-table/data-table';

import { moviesTableColumns } from './movies-table.columns';
import type { MovieModel } from '../../../domain/models/movie.model';
import { toMovieTableRow } from '../../mappers/movie-table-row.mapper';

@Component({
  selector: 'app-movies-table',
  imports: [DataTable],
  templateUrl: './movies-table.html',
})
export class MoviesTable {
  private readonly languageService = inject(LanguageService);

  readonly movies = input.required<readonly MovieModel[]>();

  protected readonly columns = moviesTableColumns;

  protected readonly rows = computed(() => {
    const locale = this.languageService.activeLocale();

    return this.movies().map((movie) => toMovieTableRow(movie, locale));
  });
}
