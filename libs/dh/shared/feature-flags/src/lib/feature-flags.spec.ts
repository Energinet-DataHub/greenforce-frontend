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
import { differenceInDays, parse } from 'date-fns';
import {
  DhFeatureFlag,
  DhFeatureFlags,
  dhFeatureFlagsConfig,
} from './feature-flags';

const maxAgeOfDays = 62;

const featureFlagCases = Object.keys(dhFeatureFlagsConfig).map(
  (featureFlag) => {
    const created = (
      dhFeatureFlagsConfig[featureFlag as DhFeatureFlags] as DhFeatureFlag
    ).created;
    const parsedDate = parse(created, 'dd-MM-yyyy', new Date());
    const diffInDays = differenceInDays(new Date(), parsedDate);

    return [featureFlag, diffInDays];
  }
);

if (featureFlagCases.length === 0) {
  test('empty feature flags list', () => {
    expect(featureFlagCases).toStrictEqual([]);
  });
}

// Note: `test.each` must not be called with an empty array
if (featureFlagCases.length > 0) {
  test.each(featureFlagCases)(
    `The feature flag: "%s" must not be older than ${maxAgeOfDays} days, but is %s days old!`,
    (_, ageOfFeatureFlag) => {
      expect(ageOfFeatureFlag).toBeLessThanOrEqual(maxAgeOfDays);
    }
  );
}
