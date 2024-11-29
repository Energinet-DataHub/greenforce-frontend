import {
  environment,
  EoApiEnvironment,
  loadEoApiEnvironment as _loadEoApiEnvironment,
} from '@energinet-datahub/eo/shared/environments';

export function loadEoApiEnvironment(): Promise<EoApiEnvironment> {
  const configurationFilename = environment.production
    ? 'eo-api-environment.json'
    : 'eo-api-environment.local.json';

  return _loadEoApiEnvironment(configurationFilename);
}
