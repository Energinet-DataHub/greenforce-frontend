import { InjectionToken } from '@angular/core';
import { eovLocalApiEnvironment } from '@energinet-datahub/eov/shared/assets';

import { environment } from '../environment';

export type EovApiEnvironment = {
  readonly adminApiUrl: string;
  readonly customerApiUrl: string;
  readonly thirdPartyApiUrl: string;
  readonly netsBaseURL: string;
  readonly clientId: string;
}

export const eovApiEnvironmentToken = new InjectionToken<EovApiEnvironment>('eovApiEnvironmentToken', {
  factory: (): EovApiEnvironment => {
    if (environment.production) {
      throw new Error('No Energy Overview API environment provided.');
    }

    // Used for unit and integration tests
    return eovLocalApiEnvironment;
  },
  providedIn: 'platform',
});

