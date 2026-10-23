import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco } from '@jsverse/transloco';
import { of } from 'rxjs';
import { ModalService } from '@shared/ui/modal/modal.service';
import { SupportedLocale } from '@shared/localization/supported-locale';
import { HintPreview } from './hint-preview';
import { HintCard } from '../hint-card/hint-card';
import { hintFixture } from '../../../testing/hint.fixtures';
import { HintType } from '../../../domain/values/hint-type';

class EmptyTranslationLoader {
  getTranslation() {
    return of({});
  }
}
@Component({
  selector: 'app-preview-test-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class PreviewTestHost {
  readonly container = inject(ViewContainerRef);
}

describe('Hint preview and compact cards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
          loader: EmptyTranslationLoader,
        }),
      ],
    });
  });
  afterEach(() => TestBed.resetTestingModule());
  it('keeps clue content out of the card and exposes a preview action with the server icon', async () => {
    const fixture = TestBed.createComponent(HintCard);
    fixture.componentRef.setInput('hint', {
      ...hintFixture(),
      type: HintType.Actor,
      info: [
        { ...hintFixture().info[0], text: 'Hidden clue', image: 'https://media.test/clue.png' },
      ],
    });
    const preview = vi.fn();
    fixture.componentInstance.preview.subscribe(preview);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('Hidden clue');
    expect(element.querySelector('app-media-image')).toBeNull();
    expect(element.querySelector('app-hint-icon img')?.getAttribute('src')).toBe(
      hintFixture().icon,
    );
    element.querySelector<HTMLButtonElement>('app-button button')!.click();
    expect(preview).toHaveBeenCalledTimes(1);
  });
  it.each([HintType.Actor, HintType.Plot])(
    'shows the actual %s content in a dedicated modal',
    async (type) => {
      const fixture = TestBed.createComponent(PreviewTestHost);
      TestBed.inject(ModalService).open(
        HintPreview,
        {
          hint: {
            ...hintFixture(),
            type,
            info: [
              {
                ...hintFixture().info[0],
                image: type === HintType.Actor ? 'https://media.test/clue.png' : null,
              },
            ],
          },
          locale: SupportedLocale.English,
        },
        { viewContainerRef: fixture.componentInstance.container },
      );
      await vi.waitFor(() => {
        fixture.detectChanges();
        const modal = document.querySelector('app-hint-preview');
        expect(modal).not.toBeNull();
        if (type === HintType.Actor) {
          expect(modal?.querySelector('app-media-image img')?.getAttribute('src')).toBe(
            'https://media.test/clue.png',
          );
          expect(modal?.querySelector('app-select')).toBeNull();
        } else expect(modal?.textContent).toContain('A clue');
      });
    },
  );
});
