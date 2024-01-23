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
        import('@energinet-datahub/eov/landing-page/routes').then(
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
        loadComponent: () => import('@energinet-datahub/eov/core/feature-help').then(mod => mod.EovCoreFeatureHelpComponent)
      },
    ]
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
