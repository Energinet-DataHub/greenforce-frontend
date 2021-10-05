import { InjectionToken } from '@angular/core';

export const locationToken = new InjectionToken<Location>('locationToken', {
  factory: () => location,
  providedIn: 'platform',
});
