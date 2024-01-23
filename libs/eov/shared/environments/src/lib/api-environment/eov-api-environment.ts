import { InjectionToken } from '@angular/core';
import { eovApiEnvironment } from '@energinet-datahub/eov/shared/assets';

import { environment } from '../environment';

export type EovApiEnvironment = {
  readonly apiUrl: string;
  readonly isProduction: boolean;
  readonly netsBaseURL: string;
  readonly clientId: string;
}

export const eovApiEnvironmentToken = new InjectionToken<EovApiEnvironment>('eovApiEnvironmentToken', {
  factory: (): EovApiEnvironment => {
    if (environment.production) {
      throw new Error('No Energy Overview API environment provided.');
    }

    // Used for unit and integration tests
    return eovApiEnvironment;
  },
  providedIn: 'platform',
});

