import { makeEnvironmentProviders } from '@angular/core';
import { MATERIAL_SANITY_CHECKS, SanityChecks } from '@angular/material/core';

const disableThemeCheck: SanityChecks = {
  doctype: true,
  /**
   * `getComputedStyle` does not work with Jest so this check will fail.
   */
  theme: false,
  version: true,
};

/**
 * Disable theme check because it always fails in Jest tests.
 *
 * Fake the icon registry to enable verification of SVG icons.
 */
export const gfAngularMaterialTestingProviders = makeEnvironmentProviders([
  {
    provide: MATERIAL_SANITY_CHECKS,
    useValue: disableThemeCheck,
  },
]);
