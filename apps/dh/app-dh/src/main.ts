//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { enableProdMode, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { dhLocalApiEnvironment } from '@energinet-datahub/dh/shared/assets';
import {
  dhApiEnvironmentToken,
  dhB2CEnvironmentToken,
  dhAppEnvironmentToken,
  environment,
} from '@energinet-datahub/dh/shared/environments';
import { dhCoreShellProviders, dhCoreShellRoutes } from '@energinet-datahub/dh/core/shell';

import { loadDhApiEnvironment } from './configuration/load-dh-api-environment';
import { loadDhB2CEnvironment } from './configuration/load-dh-b2c-environment';
import { loadDhAppEnvironment } from './configuration/load-dh-app-environment';

import { DataHubAppComponent } from './app/datahub-app.component';

declare const ngDevMode: boolean;

if (environment.production) {
  enableProdMode();
}

if (ngDevMode && environment.mocked) {
  // Dynamically import the MSW setup to avoid loading it in production
  Promise.all([
    import('@energinet-datahub/gf/msw/test-util-msw-setup'),
    import('@energinet-datahub/dh/shared/test-util-mocks'),
  ]).then(([{ setupServiceWorker }, { mocks }]) => {
    setupServiceWorker(dhLocalApiEnvironment.apiBase, mocks).then(bootstrapApp);
  });
} else {
  bootstrapApp();
}

function bootstrapApp() {
  Promise.all([loadDhApiEnvironment(), loadDhB2CEnvironment(), loadDhAppEnvironment()])
    .then(([dhApiEnvironment, dhB2CEnvironment, dhAppEnvironment]) => {
      return bootstrapApplication(DataHubAppComponent, {
        providers: [
          provideZoneChangeDetection(),
          { provide: dhApiEnvironmentToken, useValue: dhApiEnvironment },
          { provide: dhB2CEnvironmentToken, useValue: dhB2CEnvironment },
          { provide: dhAppEnvironmentToken, useValue: dhAppEnvironment },
          provideHttpClient(withInterceptorsFromDi()),
          dhCoreShellProviders,
          provideRouter(
            dhCoreShellRoutes,
            withComponentInputBinding(),
            withRouterConfig({ paramsInheritanceStrategy: 'always' }),
            withInMemoryScrolling({
              anchorScrolling: 'enabled',
              scrollPositionRestoration: 'enabled',
            })
          ),
          provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
          }),
        ],
      });
    })
    .then(() => removeStartupSplash())
    .catch((error: unknown) => {
      // Ensure the splash is removed even when bootstrap fails so the user
      // is not stuck looking at an indefinite spinner.
      removeStartupSplash();
      console.error(error);
    });
}

/**
 * Removes the static loading splash defined in `index.html`. The splash is
 * kept visible from the very first paint until Angular has fully bootstrapped
 * (which, due to `dhActorTokenInitializer`, includes warming the user-actor
 * token cache). A short fade-out is applied to avoid an abrupt flicker.
 */
function removeStartupSplash(): void {
  const splash = document.getElementById('dh-startup-splash');
  if (!splash) return;

  splash.classList.add('dh-startup-splash--hidden');

  const remove = () => splash.remove();
  splash.addEventListener('transitionend', remove, { once: true });
  // Fallback in case the transition never fires (e.g. reduced motion).
  setTimeout(remove, 400);
}
