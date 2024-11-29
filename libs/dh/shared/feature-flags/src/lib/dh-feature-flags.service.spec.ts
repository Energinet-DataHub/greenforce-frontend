import { DhAppEnvironment } from '@energinet-datahub/dh/shared/environments';

import { DhFeatureFlags, FeatureFlagConfig } from './dh-feature-flags';
import { DhFeatureFlagsService } from './dh-feature-flags.service';

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
