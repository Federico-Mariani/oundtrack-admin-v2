import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Decorative placeholder; the loading owner supplies one accessible status message. */
@Component({
  selector: 'app-shimmer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block overflow-hidden rounded-md bg-muted', 'aria-hidden': 'true' },
  template: '<span class="shimmer-sweep"></span>',
  styles: `
    .shimmer-sweep {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--foreground) 8%, transparent),
        transparent
      );
      transform: translateX(-100%);
      animation: shimmer 1.5s ease-in-out infinite;
    }
    @keyframes shimmer {
      to {
        transform: translateX(100%);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .shimmer-sweep {
        animation: none;
        transform: none;
      }
    }
  `,
})
export class Shimmer {}
