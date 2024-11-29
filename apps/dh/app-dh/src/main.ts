import { enableProdMode, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

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

if (environment.authDisabled) {
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
