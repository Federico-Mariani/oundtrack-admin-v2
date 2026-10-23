import { IconButton } from '@shared/ui/icon-button/icon-button';
import { HintPreview } from '../hint-preview/hint-preview';
import { HintCard } from '../hint-card/hint-card';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { HintsFacade } from '../../../application/state/facades/hints.facade';
import { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import { HINT_TYPES } from '../../../domain/values/hint-type';
import type { HintModel } from '../../../domain/models/hint.model';
import type { HintOwner } from '../../../domain/values/hint-owner';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import { ModalService } from '@shared/ui/modal/modal.service';
import { Button } from '@shared/ui/button/button';
import { HintsListSkeleton } from './hints-list-skeleton';
import { HintEditor } from '../hint-editor/hint-editor';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideRefreshCw } from '@ng-icons/lucide';

@Component({
  selector: 'app-hints-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Button, HintsListSkeleton, HintCard, IconButton],
  providers: [
    provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader }),
    provideIcons({ lucidePlus, lucideRefreshCw }),
  ],
  templateUrl: './hints-panel.html',
})
export class HintsPanel {
  readonly owner = input.required<HintOwner>();
  readonly locale = input.required<SupportedLocale>();
  private readonly facade = inject(HintsFacade);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  readonly sessionId = input.required<string>();
  private editorOpen = false;
  protected readonly modes = HintEditorMode;
  protected readonly loading = this.facade.requests.load.isLoading;
  protected readonly error = this.facade.requests.load.error;
  protected readonly loaded = this.facade.data.loaded;
  protected readonly hints = computed(() =>
    [...this.facade.data.hints()].sort(
      (a, b) => HINT_TYPES.indexOf(a.type) - HINT_TYPES.indexOf(b.type),
    ),
  );
  protected readonly availableTypes = computed(() =>
    HINT_TYPES.filter((type) => !this.hints().some((hint) => hint.type === type)),
  );
  protected reload(): void {
    this.facade.actions.load(this.sessionId(), this.owner().id);
  }
  protected preview(hint: HintModel): void {
    if (this.editorOpen) return;
    this.editorOpen = true;
    this.modals
      .open(
        HintPreview,
        { hint, locale: this.locale() },
        {
          viewContainerRef: this.viewContainerRef,
          contentClass:
            'w-[min(40rem,calc(100vw-2rem))] max-w-none max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8',
        },
      )
      .closed$.subscribe(() => {
        this.editorOpen = false;
      });
  }
  protected manage(mode: HintEditorMode, hint?: HintModel): void {
    if (this.editorOpen || this.loading() || !this.loaded()) return;
    this.editorOpen = true;
    this.modals
      .open(
        HintEditor,
        {
          mode,
          owner: this.owner(),
          locale: this.locale(),
          sessionId: this.sessionId(),
          hint,
          availableTypes: this.availableTypes(),
        },
        {
          viewContainerRef: this.viewContainerRef,
          disableClose: true,
          contentClass: 'w-[min(36rem,calc(100vw-2rem))] max-w-none p-6 sm:p-8',
        },
      )
      .closed$.subscribe(() => {
        this.editorOpen = false;
        if (
          this.facade.data.creationUncertain() ||
          (this.facade.data.preparedHint() && this.facade.requests.save.error())
        )
          this.reload();
      });
  }
}
