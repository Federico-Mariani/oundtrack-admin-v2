import { InjectionToken } from '@angular/core';
import type { MoviesFeedbackPort } from '../ports/movies-feedback.port';

export const MOVIES_FEEDBACK_PORT = new InjectionToken<MoviesFeedbackPort>('MOVIES_FEEDBACK_PORT');
