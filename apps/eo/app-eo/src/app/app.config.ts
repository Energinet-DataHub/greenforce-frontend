import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { eoCoreShellProviders, eoShellRoutes } from '@energinet-datahub/eo/core/shell';
import { provideRouter } from '@angular/router';
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: eoApiEnvironmentToken, useValue: eoApiEnvironment },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    ...eoCoreShellProviders,
    provideRouter(eoShellRoutes),
    // this api is first available in Angular 16
    // provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
};
