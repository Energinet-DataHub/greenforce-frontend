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
/* eslint-disable sonarjs/no-duplicate-string */
import { DhAppEnvironment } from '@energinet-datahub/dh/shared/environments';

export type DhFeatureFlag = {
  created: string;
  disabledEnvironments: DhAppEnvironment[];
};

function satisfies<A>() {
  return <T extends A>(x: T) => x;
}
export type FeatureFlagConfig = Record<string, DhFeatureFlag>;
const makeFeatureFlags = satisfies<FeatureFlagConfig>();

/**
 * Feature flag example:
 *
 * 'example-feature-flag': {
 *   created: '01-01-2022',
 *   disabledEnvironments: [DhAppEnvironment.prod],
 * },
 */
export const dhFeatureFlagsConfig = makeFeatureFlags({
  charges_price_date_chips_feature_flag: {
    created: '19-12-2022',
    disabledEnvironments: [],
  },
  charge_prices_download_button_feature_flag: {
    created: '19-12-2022',
    disabledEnvironments: [],
  },
  create_charge_prices_page_feature_flag: {
    created: '19-12-2022',
    disabledEnvironments: [],
  },
});

export type DhFeatureFlags = keyof typeof dhFeatureFlagsConfig;
