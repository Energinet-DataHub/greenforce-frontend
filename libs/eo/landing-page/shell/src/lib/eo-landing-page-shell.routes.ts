import { Routes } from '@angular/router';
import { EoLandingPageShellComponent } from './shell.component';

export const eoLandingPageRoutes: Routes = [
  { path: '', component: EoLandingPageShellComponent },
  /**
   * API documentation
   */
  {
    path: 'documentation',
    loadChildren: () =>
      import('@energinet-datahub/eo/api-documentation').then((m) => m.eoApiDocumentationRoutes),
  },
];
