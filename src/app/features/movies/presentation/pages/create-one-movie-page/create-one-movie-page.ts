import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { HlmButton } from '@spartan-ng/helm/button';
import { MOVIES_NAVIGATION } from '../../routing/movies.navigation';

@Component({
  selector: 'app-create-one-movie-page',
  templateUrl: './create-one-movie-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoDirective, HlmButton],
})
export class CreateOneMoviePage {
  protected readonly moviesLink = MOVIES_NAVIGATION.root();
}
