import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideImage } from '@ng-icons/lucide';

@Component({
  selector: 'app-hint-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ lucideImage })],
  host: { class: 'flex size-18 shrink-0 items-center justify-center' },
  templateUrl: './hint-icon.html',
})
export class HintIcon {
  readonly src = input<string | null | undefined>();
  protected readonly failed = signal<string | null | undefined>(undefined);
  protected readonly visible = computed(() => !!this.src() && this.src() !== this.failed());
}
