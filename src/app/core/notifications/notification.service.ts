import {Injectable} from '@angular/core';
import {toast} from '@spartan-ng/brain/sonner';

/**
 * Application-wide capability to surface transient user feedback as toasts.
 *
 * It is a thin wrapper over Spartan Sonner (`@spartan-ng/brain/sonner`): the
 * rest of the application depends on this small, framework-neutral API and
 * never imports Sonner directly. There is intentionally no store, facade or
 * event bus here — a toast is a fire-and-forget UI side effect.
 *
 * Messages must already be localized by the caller (presentation owns i18n).
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  message(message: string): void {
    toast.message(message);
  }

  error(message: string): void {
    toast.error(message);
  }

  success(message: string): void {
    toast.success(message);
  }

  warning(message: string): void {
    toast.warning(message);
  }

  info(message: string): void {
    toast.info(message);
  }
}
