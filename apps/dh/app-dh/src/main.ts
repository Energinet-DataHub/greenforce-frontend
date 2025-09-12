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
import { enableProdMode, isDevMode } from '@angular/core';
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

if (environment.authDisabled) {
  const searchParams = new URLSearchParams(window.location.search);
  const debugToken = searchParams.get('debugToken');

  if (debugToken) {
    localStorage.setItem('access_token', debugToken);
  }
}

if (ngDevMode && environment.mocked) {
  // Dynamically import the MSW setup to avoid loading it in production
  Promise.all([
    import('@energinet-datahub/gf/util-msw'),
    import('@energinet-datahub/dh/shared/data-access-mocks'),
  ]).then(([{ setupServiceWorker }, { mocks }]) => {
    setupServiceWorker(dhLocalApiEnvironment.apiBase, mocks).then(bootstrapApp);
  });
} else {
  bootstrapApp();
}

function bootstrapApp() {
  Promise.all([loadDhApiEnvironment(), loadDhB2CEnvironment(), loadDhAppEnvironment()])
    .then(([dhApiEnvironment, dhB2CEnvironment, dhAppEnvironment]) => {
      bootstrapApplication(DataHubAppComponent, {
        providers: [
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
    .catch((error: unknown) => console.error(error));
}
