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
