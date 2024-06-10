import { EoB2cEnvironment, EoB2cSettings } from './eo-b2c-environment';

export function loadEoB2cEnvironment(configurationFilename: string): Promise<EoB2cEnvironment> {
  return fetch(`/assets/configuration/${configurationFilename}`).then(async (response) => {
    return response.json().then((data: EoB2cSettings) => (data['azure-b2c']) );
  });
}
