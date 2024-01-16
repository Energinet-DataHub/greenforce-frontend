import { Routes } from '@angular/router';
import { EovShellComponent } from './eov-shell.component';

export const eovShellRoutes: Routes = [
  {
    path: '',
    component: EovShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
        import('@energinet-datahub/eov/landing-page/shell').then(
          (esModule) => esModule.eovLandingPageRoutes
        ),
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('@energinet-datahub/eov/overview/shell').then(
            (esModule) => esModule.eovOverviewRoutes
          ),
      },
      {
        path: 'help',
        loadChildren: () =>
          import('@energinet-datahub/eov/help/routing').then(
            (esModule) => esModule.eovHelpRoutes
          ),
      },
    ]
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
