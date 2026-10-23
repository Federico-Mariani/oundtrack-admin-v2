import { loadHintsPanel } from './load-hints-panel';
import { hintsTranslationsLoader } from '../../i18n/hints-translations.loader';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { HintsFacade } from '../../../application/state/facades/hints.facade';
import type { HintOwner } from '../../../domain/values/hint-owner';
@Injectable()
export class HintsSession {
  readonly id = crypto.randomUUID();
  private readonly facade = inject(HintsFacade);
  private owner?: HintOwner;
  private readonly language = inject(LanguageService);
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.facade.actions.close(this.id);
    });
  }
  open(owner: HintOwner): void {
    if (this.owner?.id === owner.id && this.owner.type === owner.type) return;
    this.owner = owner;
    this.facade.actions.open(this.id, owner);
    this.facade.actions.load(this.id, owner.id);
    void loadHintsPanel().catch(() => undefined);
    void hintsTranslationsLoader[this.language.activeLanguage()]().catch(() => undefined);
  }
}
