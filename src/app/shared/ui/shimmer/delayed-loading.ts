import { effect, signal, type Signal } from '@angular/core';
export function delayedLoading(loading: Signal<boolean>, delay = 150): Signal<boolean> {
  const visible = signal(false);
  effect((cleanup) => {
    if (!loading()) {
      visible.set(false);
      return;
    }
    const timeout = setTimeout(() => {
      visible.set(true);
    }, delay);
    cleanup(() => {
      clearTimeout(timeout);
    });
  });
  return visible.asReadonly();
}
