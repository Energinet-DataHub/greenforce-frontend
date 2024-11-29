import { render, screen } from '@testing-library/angular';

import { DhAppEnvironment, dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { DhFeatureFlagDirective } from './dh-feature-flag.directive';
import { FeatureFlagConfig } from './dh-feature-flags';
import { dhFeatureFlagsToken } from './dh-feature-flags.service';

describe(DhFeatureFlagDirective, () => {
  const featureFlagsConfigMock: FeatureFlagConfig = {
    'enabled-flag': {
      created: '01-01-2022',
      disabledEnvironments: [],
    },
    'disabled-flag': {
      created: '01-01-2022',
      disabledEnvironments: [
        DhAppEnvironment.local,
        DhAppEnvironment.dev_001,
        DhAppEnvironment.test_001,
      ],
    },
  };
  const setup = async (featureFlagName = '') => {
    await render(`<div *dhFeatureFlag="'${featureFlagName}'">SOME CONTENT</div>`, {
      imports: [DhFeatureFlagDirective],
      providers: [
        {
          provide: dhAppEnvironmentToken,
          useValue: { current: DhAppEnvironment.test_001 },
        },
        { provide: dhFeatureFlagsToken, useValue: featureFlagsConfigMock },
      ],
    });
  };
  const queryContent = () => screen.queryByText(/SOME CONTENT/i);

  it('should render content, if no feature flag name is provided', async () => {
    await setup();
    expect(queryContent()).toBeInTheDocument();
  });

  it('should render content, if feature flag is enabled', async () => {
    await setup('enabled-flag');
    expect(queryContent()).toBeInTheDocument();
  });

  it('should not render content, if feature flag is disabled', async () => {
    await setup('disabled-flag');
    expect(queryContent()).not.toBeInTheDocument();
  });
});
