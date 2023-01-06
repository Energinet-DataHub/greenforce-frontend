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
import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  DhAppEnvironment,
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';

import {
  dhFeatureFlagsConfig,
  DhFeatureFlags,
  FeatureFlagConfig,
} from './feature-flags';

export const dhFeatureFlagsToken = new InjectionToken<FeatureFlagConfig>(
  'dhFeatureFlagsToken',
  {
    factory: (): FeatureFlagConfig => {
      return dhFeatureFlagsConfig;
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class DhFeatureFlagsService {
  private environment: DhAppEnvironment;

  constructor(
    @Inject(dhAppEnvironmentToken)
    dhEnvironment: DhAppEnvironmentConfig,
    @Inject(dhFeatureFlagsToken) private dhFeatureFlags: FeatureFlagConfig
  ) {
    /**
     * Treat pre-prod as prod
     */
    this.environment = dhEnvironment.current;
  }

  isEnabled(flagName?: DhFeatureFlags): boolean {
    if (!flagName) return true;

    return !this.dhFeatureFlags[flagName]?.disabledEnvironments.includes(
      this.environment
    );
  }
}
