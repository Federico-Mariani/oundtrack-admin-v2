import { MediaImage } from '@shared/ui/media-image/media-image';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { HintsFacade } from '../../../application/state/facades/hints.facade';
import { HintEditorMode } from '../../../application/workflows/hint-editor.mode';
import { HINT_TYPES } from '../../../domain/values/hint-type';
import type { HintModel } from '../../../domain/models/hint.model';
import type { HintOwner } from '../../../domain/values/hint-owner';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@shared/localization/supported-locale';
import { ModalService } from '@shared/ui/modal/modal.service';
import { Button } from '@shared/ui/button/button';
import { Shimmer } from '@shared/ui/shimmer/shimmer';
import { HintEditor } from '../hint-editor/hint-editor';
@Component({
  selector: 'app-hints-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Button, Shimmer, MediaImage],
  providers: [provideTranslocoScope({ scope: 'hints', loader: hintsTranslationsLoader })],
  templateUrl: './hints-panel.html',
})
export class HintsPanel {
  readonly owner = input.required<HintOwner>();
  readonly locale = input.required<SupportedLocale>();
  private readonly facade = inject(HintsFacade);
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly sessionId = crypto.randomUUID();
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
  constructor() {
    effect(() => {
      const owner = this.owner();
      untracked(() => {
        this.facade.actions.open(this.sessionId, owner);
        this.reload();
      });
    });
    inject(DestroyRef).onDestroy(() => {
      this.facade.actions.close(this.sessionId);
    });
  }
  protected reload(): void {
    this.facade.actions.load(this.sessionId, this.owner().id);
  }
  protected image(hint: HintModel): string | null {
    return hint.info.find((info) => info.language === this.locale())?.image ?? null;
  }
  protected text(hint: HintModel): string | undefined {
    return hint.info.find((info) => info.language === this.locale())?.text ?? undefined;
  }
  protected canTranslate(hint: HintModel): boolean {
    return SUPPORTED_LOCALES.some((locale) => !hint.info.some((info) => info.language === locale));
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
          sessionId: this.sessionId,
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
      });
  }
}
