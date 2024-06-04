import { EttApiEnvironment } from './ett-api-environment';

export function loadEttApiEnvironment(configurationFilename: string): Promise<EttApiEnvironment> {
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) => response.json());
}
