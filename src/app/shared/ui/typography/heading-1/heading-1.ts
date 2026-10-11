import { Component, input } from '@angular/core';
import { hlmH1 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-heading-1',
  templateUrl: './heading-1.html',
})
export default class Heading1 {
  readonly text = input.required();
  protected readonly hlmH1 = hlmH1;
}
