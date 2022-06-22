import { DhAppEnvironments } from '@energinet-datahub/dh/shared/environments';

import { DhFeatureFlag } from './feature-flags';
import { DhFeatureFlagsService } from './feature-flags.service';

const featureFlagMocks: DhFeatureFlag[] = [
  {
    name: 'dummy-feature',
    created: new Date().toISOString(),
    disabledEnvironments: [DhAppEnvironments.preProd, DhAppEnvironments.prod],
  },
];

describe('Feature flags service', () => {
  test('it should enable feature by default', () => {
    const isFeatureEnabled = new DhFeatureFlagsService(
      {
        current: DhAppEnvironments.local,
      },
      featureFlagMocks
    ).isEnabled('this feature flag name, does not exist');

    expect(isFeatureEnabled).toEqual(true);
  });

  /**
   * Feature flag name | Environment | Should feature be enabled? | Feature flags
   */
  const nonExistingFeatureFlagName = 'non-existing-feature-flag';
  const cases = [
    [nonExistingFeatureFlagName, DhAppEnvironments.preDev, true, []],
    [nonExistingFeatureFlagName, DhAppEnvironments.dev, true, []],
    [nonExistingFeatureFlagName, DhAppEnvironments.preTest, true, []],
    [nonExistingFeatureFlagName, DhAppEnvironments.test, true, []],
    [nonExistingFeatureFlagName, DhAppEnvironments.preProd, true, []],
    [nonExistingFeatureFlagName, DhAppEnvironments.prod, true, []],
    [featureFlagMocks[0].name, DhAppEnvironments.preDev, true, featureFlagMocks],
    [featureFlagMocks[0].name, DhAppEnvironments.dev, true, featureFlagMocks],
    [featureFlagMocks[0].name, DhAppEnvironments.preTest, true, featureFlagMocks],
    [featureFlagMocks[0].name, DhAppEnvironments.test, true, featureFlagMocks],
    [featureFlagMocks[0].name, DhAppEnvironments.preProd, false, featureFlagMocks],
    [featureFlagMocks[0].name, DhAppEnvironments.prod, false, featureFlagMocks],
  ];

  test.each(cases as unknown as TemplateStringsArray)(
    '"%s" in environment: %s, should be enalbed: %s',
    (featureFlagName, environment, shouldFeatureBeEnabled, featureFlags) => {
      const isFeatureEnabled = new DhFeatureFlagsService(
        {
          current: environment as string,
        },
        featureFlags as unknown as DhFeatureFlag[]
      ).isEnabled(featureFlagName);

      expect(isFeatureEnabled).toEqual(shouldFeatureBeEnabled);
    }
  );
});
