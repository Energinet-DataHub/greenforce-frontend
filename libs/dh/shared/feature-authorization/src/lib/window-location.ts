import { InjectionToken } from '@angular/core';

export const windowLocationToken = new InjectionToken<Location>('windowLocationToken', {
  factory: () => window.location,
});
