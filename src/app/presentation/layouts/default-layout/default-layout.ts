import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet
  ]
})
export class DefaultLayout {

}
