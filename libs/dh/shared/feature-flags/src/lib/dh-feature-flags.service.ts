import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  DhAppEnvironment,
  DhAppEnvironmentConfig,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';

import { dhFeatureFlagsConfig, DhFeatureFlags, FeatureFlagConfig } from './dh-feature-flags';

export const dhFeatureFlagsToken = new InjectionToken<FeatureFlagConfig>('dhFeatureFlagsToken', {
  factory: (): FeatureFlagConfig => {
    return dhFeatureFlagsConfig;
  },
});

@Injectable({
  providedIn: 'root',
})
export class DhFeatureFlagsService {
  private environment: DhAppEnvironment;

  constructor(
    @Inject(dhAppEnvironmentToken)
    dhEnvironment: DhAppEnvironmentConfig,
    @Inject(dhFeatureFlagsToken) private dhFeatureFlags: FeatureFlagConfig
  ) {
    this.environment = dhEnvironment.current;
  }

  isEnabled(flagName?: DhFeatureFlags): boolean {
    if (!flagName) return true;

    return !this.dhFeatureFlags[flagName]?.disabledEnvironments.includes(this.environment);
  }
}
