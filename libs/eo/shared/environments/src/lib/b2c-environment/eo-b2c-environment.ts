import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { eoLocalB2cEnvironment } from '@energinet-datahub/eo/shared/assets';

import { environment } from '../environment';
import { isPlatformBrowser } from '@angular/common';

export interface EoB2cEnvironment {
  readonly issuer: string;
  readonly client_id: string;
}

export interface EoB2cSettings {
  readonly 'azure-b2c': EoB2cEnvironment
}

export const eoB2cEnvironmentToken = new InjectionToken<EoB2cEnvironment>('eoB2cEnvironmentToken', {
  factory: (): EoB2cEnvironment => {
    if (environment.production && isPlatformBrowser(PLATFORM_ID)) {
      throw new Error('No Energy Origin B2c environment provided.');
    }

    // Used for unit and integration tests
    return eoLocalB2cEnvironment['azure-b2c'];
  },
  providedIn: 'platform',
});

