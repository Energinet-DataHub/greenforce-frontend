import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';

import { eovCoreShellProviders, eovShellRoutes } from '@energinet-datahub/eov/core/shell';

import { provideRouter, withComponentInputBinding } from '@angular/router';
import { EnergyOverviewAppComponent } from './app/energy-overview-app.component';

// if (environment.production) {
//   enableProdMode();
// }

// loadEoApiEnvironment()
//   .then((eoApiEnvironment) =>
    bootstrapApplication(EnergyOverviewAppComponent, {
      providers: [
        // { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
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
  // )
  // .catch((error: unknown) => console.error(error));
