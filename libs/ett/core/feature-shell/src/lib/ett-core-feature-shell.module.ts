import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EttShellComponent, EttShellScam } from './shell/ett-shell.component';

const routes: Routes = [
  {
    path: '',
    component: EttShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@energinet/ett/dashboard/feature-shell').then(
            (esModule) => esModule.EttDashboardFeatureShellModule
          ),
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes), EttShellScam],
})
export class EttCoreFeatureShellModule {}
