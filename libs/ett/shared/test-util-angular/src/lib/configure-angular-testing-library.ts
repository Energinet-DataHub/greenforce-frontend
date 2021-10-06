import { Config, configure } from '@testing-library/angular';

export function configureAngularTestingLibrary(
  config: Partial<Config> = {}
): void {
  configure({
    // Assume SCAMs
    excludeComponentDeclaration: true,
    ...config,
  });
}
