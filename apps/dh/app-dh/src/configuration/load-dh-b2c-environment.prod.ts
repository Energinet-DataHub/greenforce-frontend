import {
  DhB2CEnvironment,
  loadDhB2CEnvironment as _loadDhB2CEnvironment,
} from '@energinet-datahub/dh/shared/environments';

export function loadDhB2CEnvironment(): Promise<DhB2CEnvironment> {
  return _loadDhB2CEnvironment('dh-b2c-environment.json');
}
