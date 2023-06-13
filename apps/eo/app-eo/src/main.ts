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
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { loadEoApiEnvironment } from './configuration/load-eo-api-environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { EnergyOriginAppComponent } from './app/energy-origin-app.component';
import { eoShellRoutes } from '@energinet-datahub/eo/core/shell';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { browserConfigurationProviders } from '@energinet-datahub/gf/util-browser';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { eoAuthorizationInterceptorProvider } from '@energinet-datahub/eo/shared/services';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

if (environment.production) {
  enableProdMode();
}

loadEoApiEnvironment()
  .then((eoApiEnvironment) =>
    bootstrapApplication(EnergyOriginAppComponent, {
      providers: [
        importProvidersFrom(MatDialogModule),
        eoAuthorizationInterceptorProvider,
        browserConfigurationProviders,
        { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
        provideRouter(eoShellRoutes),
        provideAnimations(),
        provideHttpClient(),
        // this api is first available in Angular 16
        // provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
