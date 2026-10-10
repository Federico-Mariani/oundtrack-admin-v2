import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage {}
