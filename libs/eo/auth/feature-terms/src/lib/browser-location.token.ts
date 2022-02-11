import { InjectionToken } from '@angular/core';

export const browserLocationToken = new InjectionToken<Location>('browserLocationToken', {
  factory: () => location,
  providedIn: 'platform'
});
