import { DhApiEnvironment } from './dh-api-environment';

export function loadDhApiEnvironment(): Promise<DhApiEnvironment> {
  return fetch('/assets/configuration/dh-api-environment.json').then((response) => response.json());
}
