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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { eovCoreShellProviders, eovShellRoutes } from '@energinet-datahub/eov/core/shell';
import { environment, eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';

import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { EnergyOverviewAppComponent } from './app/energy-overview-app.component';
import { loadEovApiEnvironment } from './configuration/load-eov-api-environment';

if (environment.production) {
  enableProdMode();
}

loadEovApiEnvironment()
  .then((eovApiEnvironment) =>
    bootstrapApplication(EnergyOverviewAppComponent, {
      providers: [
        { provide: eovApiEnvironmentToken, useValue: eovApiEnvironment },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        ...eovCoreShellProviders,
        provideRouter(eovShellRoutes, {...withComponentInputBinding(), ...withInMemoryScrolling({scrollPositionRestoration: 'top'})}),
        provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
