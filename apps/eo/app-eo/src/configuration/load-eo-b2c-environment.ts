import {
  environment,
  EoB2cEnvironment,
  loadEoB2cEnvironment as _loadEoB2cEnvironment,
} from '@energinet-datahub/eo/shared/environments';

export function loadEoB2cEnvironment(): Promise<EoB2cEnvironment> {
  const configurationFilename = environment.production
    ? 'eo-azure-b2c-settings.json'
    : 'eo-azure-b2c-settings.local.json';

  return _loadEoB2cEnvironment(configurationFilename);
}
