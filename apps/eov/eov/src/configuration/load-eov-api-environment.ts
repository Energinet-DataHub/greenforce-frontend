import {
  environment,
  EovApiEnvironment,
  loadEovApiEnvironment as _loadEovApiEnvironment,
} from '@energinet-datahub/eov/shared/environments';

export function loadEovApiEnvironment(): Promise<EovApiEnvironment> {
  const configurationFilename = environment.production
    ? 'eov-api-environment.json'
    : 'eov-api-environment.local.json';

  return _loadEovApiEnvironment(configurationFilename);
}
