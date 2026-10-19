import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-tv-series-page',
  templateUrl: './tv-series-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TranslocoDirective],
})
export class TvSeriesPage {}
