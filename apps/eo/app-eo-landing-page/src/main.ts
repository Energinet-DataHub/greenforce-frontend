import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import {
  environment,
  eoApiEnvironmentToken,
  eoB2cEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { loadEoApiEnvironment } from './configuration/load-eo-api-environment';
import { loadEoB2cEnvironment } from './configuration/load-eo-b2c-environment';

if (environment.production) {
  enableProdMode();
}

Promise.all([loadEoApiEnvironment(), loadEoB2cEnvironment()])
  .then(([eoApiEnvironment, eoB2cEnvironment]) =>
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
        { provide: eoB2cEnvironmentToken, useValue: eoB2cEnvironment },
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
