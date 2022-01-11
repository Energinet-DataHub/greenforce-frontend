import { DhB2CEnvironment } from './dh-b2c-environment';

export function loadDhB2CEnvironment(configurationFilename: string): Promise<DhB2CEnvironment> {
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) => response.json());
}
