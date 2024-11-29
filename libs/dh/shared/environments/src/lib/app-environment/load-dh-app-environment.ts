import { DhAppEnvironmentConfig } from './dh-app-environment';

export function loadDhAppEnvironment(
  configurationFilename: string
): Promise<DhAppEnvironmentConfig> {
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) =>
    response.json()
  );
}
