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
import { DhFeatureFlag, featureFlags } from './feature-flags';

/**
 * Ensure we don't have multiple feature flags with the same name
 */
test('should not have multiple feature flags with the same name', () => {
  expect(() => {
    findDuplicates(featureFlags);
  }).not.toThrowError();
});

function findDuplicates(featureFlags: DhFeatureFlag[]): void {
  const featureFlagNames = featureFlags.map((featureFlag) => featureFlag.name);
  const duplicates = featureFlagNames.filter(
    (name, index) => featureFlagNames.indexOf(name) !== index
  );
  if (duplicates.length === 0) return;

  throw new Error(
    `Found multiple feature flags having the same name: ${duplicates}`
  );
}
