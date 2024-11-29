import {
  EoB2cEnvironment,
  loadEoB2cEnvironment as _loadEoB2cEnvironment,
} from '@energinet-datahub/eo/shared/environments';

export function loadEoB2cEnvironment(): Promise<EoB2cEnvironment> {
  return _loadEoB2cEnvironment('eo-azure-b2c-settings.json');
}
