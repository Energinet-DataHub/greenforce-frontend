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
import { render } from '@testing-library/angular';

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
    return await render(`<div *dhFeatureFlag="'${featureFlagName}'">SOME CONTENT</div>`, {
      imports: [DhFeatureFlagDirective],
      providers: [
        {
          provide: dhAppEnvironmentToken,
          useValue: { current: DhAppEnvironment.test_001 },
        },
        { provide: dhFeatureFlagsToken, overrides: featureFlagsConfigMock },
      ],
    });
  };

  it('should render content, if no feature flag name is provided', async () => {
    const { queryByText } = await setup();
    expect(queryByText(/SOME CONTENT/i));
  });

  it('should render content, if feature flag is enabled', async () => {
    const { queryByText } = await setup('enabled-flag');
    expect(queryByText(/SOME CONTENT/i));
  });

  it('should not render content, if feature flag is disabled', async () => {
    const { queryByText } = await setup('disabled-flag');
    expect(queryByText(/SOME CONTENT/i));
  });
});
