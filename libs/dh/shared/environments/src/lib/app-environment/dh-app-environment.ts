import { InjectionToken } from '@angular/core';

import { dhLocalAppEnvironment } from '@energinet-datahub/dh/shared/assets';

import { environment } from '../environment';

export interface DhAppEnvironmentConfig {
  current: DhAppEnvironment;
  applicationInsights: {
    instrumentationKey: string;
  };
}

export enum DhAppEnvironment {
  local = 'localhost',
  dev_001 = 'd-001',
  dev_002 = 'd-002',
  test_001 = 't-001',
  test_002 = 't-002',
  preprod = 'b-001',
  prod = 'p-001',
}

export const dhAppEnvironmentToken = new InjectionToken<DhAppEnvironmentConfig>(
  'dhAppEnvironmentToken',
  {
    factory: (): DhAppEnvironmentConfig => {
      if (environment.production) {
        throw new Error('No DataHub app environment config provided.');
      }

      // Used for unit and integration tests
      return dhLocalAppEnvironment as DhAppEnvironmentConfig;
    },
    providedIn: 'platform',
  }
);
