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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
  environment,
  ettApiEnvironmentToken,
  ettB2cEnvironmentToken,
} from '@energinet-datahub/ett/shared/environments';
import { ettCoreShellProviders, ettShellRoutes } from '@energinet-datahub/ett/core/shell';

import { loadEttApiEnvironment } from './configuration/load-ett-api-environment';
import { loadEttB2cEnvironment } from './configuration/load-ett-b2c-environment';
import { EnergyTrackAndTraceAppComponent } from './app/energy-track-and-trace-app.component';

if (environment.production) {
  enableProdMode();
}

Promise.all([loadEttApiEnvironment(), loadEttB2cEnvironment()])
  .then(([ettApiEnvironment, ettB2cEnvironment]) =>
    bootstrapApplication(EnergyTrackAndTraceAppComponent, {
      providers: [
        { provide: ettApiEnvironmentToken, useValue: ettApiEnvironment },
        { provide: ettB2cEnvironmentToken, useValue: ettB2cEnvironment },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        ...ettCoreShellProviders,
        provideRouter(ettShellRoutes, withComponentInputBinding()),
        provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
