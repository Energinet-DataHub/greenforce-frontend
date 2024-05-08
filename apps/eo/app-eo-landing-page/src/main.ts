import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { EoLandingPageShellComponent } from '@energinet-datahub/eo/landing-page/shell';

bootstrapApplication(EoLandingPageShellComponent, appConfig).catch((err) =>
  console.error(err)
);
