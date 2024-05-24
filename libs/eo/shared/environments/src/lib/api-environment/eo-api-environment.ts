import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { eoLocalApiEnvironment } from '@energinet-datahub/eo/shared/assets';

import { environment } from '../environment';
import { isPlatformBrowser } from '@angular/common';

export interface EoApiEnvironment {
  readonly apiBase: string;
  readonly developerPortal: string;
  readonly apiVersions: {
    readonly [key: string]: string;
  };
}

export const eoApiEnvironmentToken = new InjectionToken<EoApiEnvironment>('eoApiEnvironmentToken', {
  factory: (): EoApiEnvironment => {
    if (environment.production && isPlatformBrowser(PLATFORM_ID)) {
      throw new Error('No Energy Origin API environment provided.');
    }

    // Used for unit and integration tests
    return eoLocalApiEnvironment;
  },
  providedIn: 'platform',
});

