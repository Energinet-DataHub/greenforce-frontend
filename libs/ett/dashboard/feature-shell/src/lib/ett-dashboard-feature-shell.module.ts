import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  EttDashboardShellComponent,
  EttDashboardShellScam,
} from './shell/ett-dashboard-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EttDashboardShellComponent,
    children: [
      // Lazy feature routes
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes), EttDashboardShellScam],
})
export class EttDashboardFeatureShellModule {}
