import { InjectionToken } from '@angular/core';

export const ADMIN_ACCESS_TOKEN = new InjectionToken<() => string | undefined>('ADMIN_ACCESS_TOKEN');
