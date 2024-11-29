import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {
  environment,
  eoApiEnvironmentToken,
  eoB2cEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { eoCoreShellProviders, eoShellRoutes } from '@energinet-datahub/eo/core/shell';

import { loadEoApiEnvironment } from './configuration/load-eo-api-environment';
import { loadEoB2cEnvironment } from './configuration/load-eo-b2c-environment';
import { EnergyOriginAppComponent } from './app/energy-origin-app.component';

if (environment.production) {
  enableProdMode();
}

Promise.all([loadEoApiEnvironment(), loadEoB2cEnvironment()])
  .then(([eoApiEnvironment, eoB2cEnvironment]) =>
    bootstrapApplication(EnergyOriginAppComponent, {
      providers: [
        { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
        { provide: eoB2cEnvironmentToken, useValue: eoB2cEnvironment },
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        ...eoCoreShellProviders,
        provideRouter(eoShellRoutes, withComponentInputBinding()),
        provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
