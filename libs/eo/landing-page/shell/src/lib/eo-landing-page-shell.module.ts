import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  EoLandingPageShellComponent,
  EoLandingPageShellScam
} from './eo-landing-page-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EoLandingPageShellComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    EoLandingPageShellScam
  ],
})
export class EoLandingPageShellModule {}
