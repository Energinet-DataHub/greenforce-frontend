import { EoApiEnvironment } from './eo-api-environment';

export function loadEoApiEnvironment(configurationFilename: string): Promise<EoApiEnvironment> {
  console.log('LOADING EO API ENVIRONMENT', configurationFilename);
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) => response.json());
}
