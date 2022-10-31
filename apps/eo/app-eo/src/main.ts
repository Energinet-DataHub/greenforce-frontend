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
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  environment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { EnergyOriginAppModule } from './app/energy-origin-app.module';
import { loadEoApiEnvironment } from './configuration/load-eo-api-environment';

if (environment.production) {
  enableProdMode();
}

loadEoApiEnvironment()
  .then((eoApiEnvironment) =>
    platformBrowserDynamic([
      { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
    ]).bootstrapModule(EnergyOriginAppModule, {
      ngZoneEventCoalescing: true,
      ngZoneRunCoalescing: true,
    })
  )
  .catch((error: unknown) => console.error(error));
