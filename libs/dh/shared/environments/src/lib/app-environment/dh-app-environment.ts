/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
  dev = 'u-001',
  experimental = 'u-002',
  test = 't-001',
  preProd = 'b-001',
  prod = 'b-002',
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
