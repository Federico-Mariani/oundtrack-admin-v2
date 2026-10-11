import { Component, input } from '@angular/core';
import { hlmH2 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-heading-2',
  templateUrl: './heading-2.html',
})
export default class Heading2 {
  readonly text = input.required();
  protected readonly hlmH2 = hlmH2;
}
