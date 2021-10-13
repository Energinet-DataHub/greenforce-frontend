import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  EttAuthShellComponent,
  EttAuthShellScam,
} from './ett-auth-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EttAuthShellComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), EttAuthShellScam],
})
export class EttAuthFeatureShellModule {}
