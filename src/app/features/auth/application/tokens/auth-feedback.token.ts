import { InjectionToken } from '@angular/core';
import type { AuthFeedbackPort } from '../ports/auth-feedback.port';

export const AUTH_FEEDBACK_PORT = new InjectionToken<AuthFeedbackPort>('AUTH_FEEDBACK_PORT');
