import { dayjs } from '@energinet-datahub/watt/date';

import { DhFeatureFlag, DhFeatureFlags, dhFeatureFlagsConfig } from './dh-feature-flags';

const maxAgeOfDays = 62;

const featureFlagCases = Object.keys(dhFeatureFlagsConfig).map((featureFlag) => {
  const created = (dhFeatureFlagsConfig[featureFlag as DhFeatureFlags] as DhFeatureFlag).created;
  const parsedDate = dayjs(created, 'DD-MM-YYYY');
  const diffInDays = dayjs(new Date()).diff(parsedDate, 'days');

  return [featureFlag, diffInDays];
});

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
