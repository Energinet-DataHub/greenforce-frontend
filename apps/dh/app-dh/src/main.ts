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
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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

if (environment.production) {
  enableProdMode();
}

if (!environment.production) {
  const searchParams = new URLSearchParams(window.location.search);
  const debugToken = searchParams.get('debugToken');
  if (debugToken) {
    localStorage.setItem('access_token', debugToken);
  }
}

Promise.all([loadDhApiEnvironment(), loadDhB2CEnvironment(), loadDhAppEnvironment()])
  .then(([dhApiEnvironment, dhB2CEnvironment, dhAppEnvironment]) => {
    bootstrapApplication(DataHubAppComponent, {
      providers: [
        { provide: dhApiEnvironmentToken, useValue: dhApiEnvironment },
        { provide: dhB2CEnvironmentToken, useValue: dhB2CEnvironment },
        { provide: dhAppEnvironmentToken, useValue: dhAppEnvironment },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        ...dhCoreShellProviders,
        provideRouter(
          dhCoreShellRoutes,
          withInMemoryScrolling({
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
          })
        ),
      ],
    });
  })
  .catch((error: unknown) => console.error(error));
