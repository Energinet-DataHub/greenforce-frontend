//#region License
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
//#endregion
import { DhAppEnvironment, dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { DhFeatureFlags, FeatureFlagConfig } from './dh-feature-flags';
import { DhFeatureFlagsService, dhFeatureFlagsToken } from './dh-feature-flags.service';
import { TestBed } from '@angular/core/testing';

const featureFlagMocks: FeatureFlagConfig = {
  'dummy-feature': {
    created: new Date().toISOString(),
    disabledEnvironments: [
      DhAppEnvironment.test_001,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
};

describe('Feature flags service', () => {
  test('it should enable feature by default', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: dhFeatureFlagsToken,
          useValue: {
            current: DhAppEnvironment.local,
            applicationInsights: {
              connectionString: '',
            },
          },
        },
        {
          provide: dhAppEnvironmentToken,
          useValue: featureFlagMocks,
        },
      ],
    });
    TestBed.runInInjectionContext(() => {
      const isFeatureEnabled = new DhFeatureFlagsService().isEnabled(
        'this feature flag name, does not exist' as DhFeatureFlags
      );

      expect(isFeatureEnabled).toEqual(true);
    });
  });

  /**
   * Feature flag name | Environment | Should feature be enabled? | Feature flags
   */
  const nonExistingFeatureFlagName = 'non-existing-feature-flag';
  const existingFeatureFlagName = 'dummy-feature';

  const cases = [
    [nonExistingFeatureFlagName, DhAppEnvironment.dev_001, true, {}],
    [nonExistingFeatureFlagName, DhAppEnvironment.dev_002, true, {}],
    [nonExistingFeatureFlagName, DhAppEnvironment.test_001, true, {}],
    [nonExistingFeatureFlagName, DhAppEnvironment.test_002, true, {}],
    [nonExistingFeatureFlagName, DhAppEnvironment.preprod, true, {}],
    [nonExistingFeatureFlagName, DhAppEnvironment.prod, true, {}],

    [existingFeatureFlagName, DhAppEnvironment.dev_001, true, featureFlagMocks],
    [existingFeatureFlagName, DhAppEnvironment.dev_002, true, featureFlagMocks],
    [existingFeatureFlagName, DhAppEnvironment.test_001, false, featureFlagMocks],
    [existingFeatureFlagName, DhAppEnvironment.test_002, true, featureFlagMocks],
    [existingFeatureFlagName, DhAppEnvironment.preprod, false, featureFlagMocks],
    [existingFeatureFlagName, DhAppEnvironment.prod, false, featureFlagMocks],
  ];

  test.each(cases)(
    '"%s" in environment: %s, should be enabled: %s',
    (featureFlagName, environment, shouldFeatureBeEnabled, featureFlags) => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: dhAppEnvironmentToken,
            useValue: {
              current: environment as DhAppEnvironment,
              applicationInsights: {
                connectionString: '',
              },
            },
          },
          {
            provide: dhFeatureFlagsToken,
            useValue: featureFlags as unknown as FeatureFlagConfig,
          },
        ],
      });
      TestBed.runInInjectionContext(() => {
        const isFeatureEnabled = new DhFeatureFlagsService().isEnabled(
          featureFlagName as DhFeatureFlags
        );

        expect(isFeatureEnabled).toEqual(shouldFeatureBeEnabled);
      });
    }
  );
});
