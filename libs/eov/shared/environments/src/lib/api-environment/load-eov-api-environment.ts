import { EovApiEnvironment } from './eov-api-environment';

export function loadEovApiEnvironment(configurationFilename: string): Promise<EovApiEnvironment> {
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) => response.json());
}
