import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { ThemeService } from './theme.service';

/**
 * Applies the resolved initial theme once at the composition root, before the
 * first render, so the `.dark` class is in place and there is no flash of the
 * wrong theme.
 */
export function provideAppTheme(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      inject(ThemeService).initialize();
    }),
  ]);
}
