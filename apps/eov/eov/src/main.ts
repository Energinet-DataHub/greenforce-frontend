import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';

import { eovCoreShellProviders, eovShellRoutes } from '@energinet-datahub/eov/core/shell';
import { environment, eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';

import { provideRouter, withComponentInputBinding } from '@angular/router';
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
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        ...eovCoreShellProviders,
        provideRouter(eovShellRoutes, withComponentInputBinding()),
        provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
        provideLottieOptions({
          player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
        }),
      ],
    })
  )
  .catch((error: unknown) => console.error(error));
