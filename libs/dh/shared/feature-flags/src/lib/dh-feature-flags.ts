import { DhAppEnvironment } from '@energinet-datahub/dh/shared/environments';

export type DhFeatureFlag = {
  created: string;
  disabledEnvironments: DhAppEnvironment[];
};

export type FeatureFlagConfig = Record<string, DhFeatureFlag>;

const latestBump = '20-11-2024';

/**
 * Feature flag example:
 *
 * 'example-feature-flag': {
 *   created: '01-01-2022',
 *   disabledEnvironments: [DhAppEnvironment.prod],
 * },
 */
export const dhFeatureFlagsConfig = {
  'calculations-include-all-grid-areas': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.test_001],
  },
  // This feature flag should be removed in favor of injected environment variables
  // from terraform, whenever the new web application setup is ready (outlaws).
  'quarterly-resolution-transition-datetime-override': {
    created: latestBump,
    disabledEnvironments: [DhAppEnvironment.preprod, DhAppEnvironment.prod],
  },
  'settlement-report-use-api': {
    created: latestBump,
    disabledEnvironments: [],
  },
  'feature-user-management-new': {
    created: latestBump,
    disabledEnvironments: [
      DhAppEnvironment.test_001,
      DhAppEnvironment.test_002,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
  'merge-market-participants': {
    created: latestBump,
    disabledEnvironments: [
      DhAppEnvironment.test_001,
      DhAppEnvironment.test_002,
      DhAppEnvironment.preprod,
      DhAppEnvironment.prod,
    ],
  },
} satisfies FeatureFlagConfig;

export type DhFeatureFlags = keyof typeof dhFeatureFlagsConfig;
