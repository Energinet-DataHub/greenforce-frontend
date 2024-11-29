// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `workspace.json`.
import { DhEnvironment } from './dh-environment';
import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';

/**
 * Mock Service Worker
 */
import { setupServiceWorker } from '@energinet-datahub/gf/util-msw';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { mocks } from '@energinet-datahub/dh/shared/data-access-mocks';

(async () => {
  await setupServiceWorker(dhLocalApiEnvironment.apiBase, mocks);
})();

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';

/**
 * Environment
 */
export const environment: DhEnvironment = {
  production: false,
  authDisabled: false,
};
