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
  readonly documentation: {id: string; title: string; src: string;}[]
}

export const ettApiEnvironmentToken = new InjectionToken<EttApiEnvironment>('ettApiEnvironmentToken', {
  factory: (): EttApiEnvironment => {
    if (environment.production && isPlatformBrowser(PLATFORM_ID)) {
      throw new Error('No Energy Track and Trace API environment provided.');
    }

    // Used for unit and integration tests
    return ettLocalApiEnvironment;
  },
  providedIn: 'platform',
});

