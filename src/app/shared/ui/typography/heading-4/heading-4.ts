import { Component, input } from '@angular/core';
import { hlmH4 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-heading-4',
  templateUrl: './heading-4.html',
})
export default class Heading4 {
  readonly text = input.required();
  protected readonly hlmH4 = hlmH4;
}
