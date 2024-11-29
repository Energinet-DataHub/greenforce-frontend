import {
  EoApiEnvironment,
  loadEoApiEnvironment as _loadEoApiEnvironment,
} from '@energinet-datahub/eo/shared/environments';

export function loadEoApiEnvironment(): Promise<EoApiEnvironment> {
  return _loadEoApiEnvironment('eo-api-environment.json');
}
