import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EttOnboardingShellComponent, EttOnboardingShellScam } from './ett-onboarding-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EttOnboardingShellComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), EttOnboardingShellScam],
})
export class EttCoreFeatureOnboardingModule {}
