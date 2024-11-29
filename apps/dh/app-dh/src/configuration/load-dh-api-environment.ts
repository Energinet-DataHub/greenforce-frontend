import {
  DhApiEnvironment,
  loadDhApiEnvironment as _loadDhApiEnvironment,
} from '@energinet-datahub/dh/shared/environments';

export function loadDhApiEnvironment(): Promise<DhApiEnvironment> {
  return _loadDhApiEnvironment('dh-api-environment.json').catch(() =>
    _loadDhApiEnvironment('dh-api-environment.local.json')
  );
}
