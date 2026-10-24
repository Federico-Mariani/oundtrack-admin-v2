import { InjectionToken } from '@angular/core';
import type { CategoryManagementPort } from '../ports/category-management.port';
export const CATEGORY_MANAGEMENT = new InjectionToken<CategoryManagementPort>(
  'CATEGORY_MANAGEMENT',
);
