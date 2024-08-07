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
import { DhAppEnvironment } from '@energinet-datahub/dh/shared/environments';

export type DhFeatureFlag = {
  created: string;
  disabledEnvironments: DhAppEnvironment[];
};

export type FeatureFlagConfig = Record<string, DhFeatureFlag>;

const latestBump = '20-06-2024';

/**
 * Feature flag example:
 *
 * 'example-feature-flag': {
 *   created: '01-01-2022',
 *   disabledEnvironments: [DhAppEnvironment.prod],
 * },
 */
export const dhFeatureFlagsConfig = {
  'market-participant-delegation': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.prod],
  },
  'calculations-include-all-grid-areas': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.test_001],
  },
  'new-login-flow': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
  'settlement-reports-v2': {
    created: latestBump,
    disabledEnvironments: [],
  },
  // This should be removed when there is no longer a need to create calculations
  // in closed periods OR as soon as possible after go-live (01-09-2024)
  'create-calculation-minimum-date': {
    created: '10-07-2024', // Intentionally not using latest bump, so it expires after go-live
    disabledEnvironments: [
      DhAppEnvironment.test_001,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
  // This feature flag should be removed in favor of injected environment variables
  // from terraform, whenever the new web application setup is ready (outlaws).
  'quarterly-resolution-transition-datetime-override': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
} satisfies FeatureFlagConfig;

export type DhFeatureFlags = keyof typeof dhFeatureFlagsConfig;
