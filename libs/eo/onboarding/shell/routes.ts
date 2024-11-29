import { Routes } from '@angular/router';

import { EoOnboardingShellComponent } from './onboarding-shell.component';
import { EoSigninCallbackComponent } from './signin-callback.component';

export const eoOnbordingRoutes: Routes = [
  { path: '', component: EoOnboardingShellComponent },
  { path: 'signin-callback', component: EoSigninCallbackComponent },
];
