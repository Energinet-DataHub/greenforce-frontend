// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `workspace.json`.
import { EoEnvironment } from './eo-environment';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';

export const environment: EoEnvironment = {
  production: false,
};

/**
 * Mock Service Worker
 */
import { setupServiceWorker } from '@energinet-datahub/gf/util-msw';
import { loadEoApiEnvironment } from './api-environment/load-eo-api-environment';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { mocks } from '@energinet-datahub/eo/shared/data-access-mocks';

loadEoApiEnvironment('eo-api-environment.local.json')
  .then((env) => {
    setupServiceWorker(env.apiBase, mocks);
  })
  .catch(() => {
    setupServiceWorker('https://demo.energytrackandtrace.dk/api', mocks);
  });
