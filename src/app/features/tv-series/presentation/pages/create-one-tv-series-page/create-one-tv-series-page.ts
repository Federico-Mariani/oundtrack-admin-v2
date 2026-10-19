import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-create-one-tv-series-page',
  templateUrl: './create-one-tv-series-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TranslocoDirective],
})
export class CreateOneTvSeriesPage {}
