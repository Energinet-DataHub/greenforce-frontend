import { Config, configure } from '@testing-library/angular';

/**
 * Configure Angular Testing Library to assume SCAMs and require semantic
 * queries.
 */
export function setUpAngularTestingLibrary(config: Partial<Config> = {}): void {
  configure({
    // Assume SCAMs
    excludeComponentDeclaration: true,
    ...config,
    dom: {
      // Require semantic queries by default
      throwSuggestions: true,
      ...(config.dom ?? {}),
    },
  });
}
