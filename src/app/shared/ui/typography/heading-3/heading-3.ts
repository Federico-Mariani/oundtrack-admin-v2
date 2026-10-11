import { Component, input } from '@angular/core';
import { hlmH3 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-heading-3',
  templateUrl: './heading-3.html',
})
export default class Heading3 {
  readonly text = input.required();
  protected readonly hlmH3 = hlmH3;
}
