import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  EoPrivacyPageShellComponent,
  EoPrivacyPageShellScam
} from './eo-privacy-page-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EoPrivacyPageShellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), EoPrivacyPageShellScam],
})
export class EoPrivacyPageShellModule {}
