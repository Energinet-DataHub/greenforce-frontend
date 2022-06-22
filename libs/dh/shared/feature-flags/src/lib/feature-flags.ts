import { DhAppEnvironments } from "@energinet-datahub/dh/shared/environments";

export interface DhFeatureFlag {
  name: string;
  created: string;
  disabledEnvironments: DhAppEnvironments[];
}

export const featureFlags: DhFeatureFlag[] = [];
