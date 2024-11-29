import { InjectionToken } from '@angular/core';
import { dhLocalB2CEnvironment } from '@energinet-datahub/dh/shared/assets';

import { environment } from '../environment';

export interface DhB2CEnvironment {
  readonly clientId: string;
  readonly scopeUri: string;
  readonly authority: string;
  readonly mitIdFlowUri: string;
  readonly knownAuthorities: string[];
}

export const dhB2CEnvironmentToken = new InjectionToken<DhB2CEnvironment>('dhB2CEnvironmentToken', {
  factory: (): DhB2CEnvironment => {
    if (environment.production) {
      throw new Error('No DataHub B2C API environment provided.');
    }

    // Used for unit and integration tests
    return dhLocalB2CEnvironment;
  },
  providedIn: 'platform',
});
