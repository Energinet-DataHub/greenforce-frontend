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

import { DhFeatureFlags, FeatureFlagConfig } from './feature-flags';
import { DhFeatureFlagsService } from './feature-flags.service';

const featureFlagMocks: FeatureFlagConfig = {
  'dummy-feature': {
    created: new Date().toISOString(),
    disabledEnvironments: [DhAppEnvironment.test],
  },
};

describe('Feature flags service', () => {
  test('it should enable feature by default', () => {
    const isFeatureEnabled = new DhFeatureFlagsService(
      {
        current: DhAppEnvironment.local,
        applicationInsights: {
          instrumentationKey: '',
        },
      },
      featureFlagMocks
    ).isEnabled('this feature flag name, does not exist' as DhFeatureFlags);

    expect(isFeatureEnabled).toEqual(true);
  });

  /**
   * Feature flag name | Environment | Should feature be enabled? | Feature flags
   */
  const nonExistingFeatureFlagName = 'non-existing-feature-flag';
  const existingFeatureFlagName = 'dummy-feature';

  const cases = [
    [nonExistingFeatureFlagName, DhAppEnvironment.dev, true, {}],
    [nonExistingFeatureFlagName, DhAppEnvironment.test, true, {}],
    [existingFeatureFlagName, DhAppEnvironment.dev, true, featureFlagMocks],
    [existingFeatureFlagName, DhAppEnvironment.test, false, featureFlagMocks],
  ];

  test.each(cases)(
    '"%s" in environment: %s, should be enabled: %s',
    (featureFlagName, environment, shouldFeatureBeEnabled, featureFlags) => {
      const isFeatureEnabled = new DhFeatureFlagsService(
        {
          current: environment as DhAppEnvironment,
          applicationInsights: {
            instrumentationKey: '',
          },
        },
        featureFlags as unknown as FeatureFlagConfig
      ).isEnabled(featureFlagName as DhFeatureFlags);

      expect(isFeatureEnabled).toEqual(shouldFeatureBeEnabled);
    }
  );
});
