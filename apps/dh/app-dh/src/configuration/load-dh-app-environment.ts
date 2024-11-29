import {
  DhAppEnvironmentConfig,
  loadDhAppEnvironment as _loadDhAppEnvironment,
} from '@energinet-datahub/dh/shared/environments';

export function loadDhAppEnvironment(): Promise<DhAppEnvironmentConfig> {
  return _loadDhAppEnvironment('dh-app-environment.json').catch(() =>
    _loadDhAppEnvironment('dh-app-environment.local.json')
  );
}
