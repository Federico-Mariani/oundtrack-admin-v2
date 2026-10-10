import { InjectionToken } from '@angular/core';
import type { AuthFeedback } from '../ports/auth-feedback';

export const AUTH_FEEDBACK_PORT = new InjectionToken<AuthFeedback>('AUTH_FEEDBACK_PORT');
