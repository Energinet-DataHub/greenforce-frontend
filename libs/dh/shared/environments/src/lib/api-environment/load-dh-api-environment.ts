import { DhApiEnvironment } from './dh-api-environment';

export function loadDhApiEnvironment(configurationFilename: string): Promise<DhApiEnvironment> {
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) => response.json());
}
