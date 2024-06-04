import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { ettLocalApiEnvironment } from '@energinet-datahub/ett/shared/assets';

import { environment } from '../environment';
import { isPlatformBrowser } from '@angular/common';

export interface EttApiEnvironment {
  readonly apiBase: string;
  readonly developerPortal: string;
  readonly apiVersions: {
    readonly [key: string]: string;
  };
}

export const EttApiEnvironmentToken = new InjectionToken<EttApiEnvironment>('EttApiEnvironmentToken', {
  factory: (): EttApiEnvironment => {
    if (environment.production && isPlatformBrowser(PLATFORM_ID)) {
      throw new Error('No Energy Track And Trace API environment provided.');
    }

    // Used for unit and integration tests
    return ettLocalApiEnvironment;
  },
  providedIn: 'platform',
});

