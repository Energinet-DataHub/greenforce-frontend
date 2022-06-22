import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  DhAppEnvironmentConfig,
  DhAppEnvironments,
  dhAppEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import { DhFeatureFlag, featureFlags } from './feature-flags';

export const dhFeatureFlagsToken = new InjectionToken<DhFeatureFlag[]>(
  'dhFeatureFlagsToken',
  {
    factory: (): DhFeatureFlag[] => {
      return featureFlags;
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class DhFeatureFlagsService {
  constructor(
    @Inject(dhAppEnvironmentToken)
    private dhEnvironment: DhAppEnvironmentConfig,
    @Inject(dhFeatureFlagsToken) private dhFeatureFlags: DhFeatureFlag[]
  ) {}

  isEnabled(flagName: string): boolean {
    const featureFlag = this.dhFeatureFlags.find(
      (featureFlag) => featureFlag.name === flagName
    );
    return !featureFlag?.disabledEnvironments.includes(
      this.dhEnvironment.current as DhAppEnvironments
    );
  }
}
