import { Component, input } from '@angular/core';
import { hlmP } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.html',
})
export default class Paragraph {
  readonly text = input.required();
  protected readonly hlmP = hlmP;
}
