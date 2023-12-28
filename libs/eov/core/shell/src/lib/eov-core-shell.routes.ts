import { Routes } from '@angular/router';

export const eovShellRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@energinet-datahub/eov/landing-page/shell').then(
        (esModule) => esModule.eovLandingPageRoutes
      ),
  },
  { path: '**', redirectTo: '' }, // Catch-all that can be used for 404 redirects in the future
];
