import { InjectionToken } from '@angular/core';
import { eoLocalApiEnvironment } from '@energinet-datahub/eo/shared/assets';

import { environment } from '../environment';

export interface EoApiEnvironment {
  readonly apiBase: string;
}

export const eoApiEnvironmentToken = new InjectionToken<EoApiEnvironment>('eoApiEnvironmentToken', {
  factory: (): EoApiEnvironment => {
    if (environment.production) {
      throw new Error('No Energy Origin API environment provided.');
    }

    // Used for unit and integration tests
    return eoLocalApiEnvironment;
  },
  providedIn: 'platform',
});

