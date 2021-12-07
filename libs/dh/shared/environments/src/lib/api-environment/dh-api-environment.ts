import { InjectionToken } from '@angular/core';
import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';

import { environment } from '../environment';

export interface DhApiEnvironment {
  readonly apiBase: string;
}

export const dhApiEnvironmentToken = new InjectionToken<DhApiEnvironment>('dhApiEnvironmentToken', {
  factory: (): DhApiEnvironment => {
    if (environment.production) {
      throw new Error('No DataHub API environment provided.');
    }

    // Used for unit and integration tests
    return dhLocalApiEnvironment;
  },
  providedIn: 'platform',
});

