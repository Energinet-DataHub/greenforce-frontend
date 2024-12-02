
import { CanActivateFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { EoMarkdownComponent } from '@energinet-datahub/eo/api-documentation/markdown';

import { EoApiDocumentationComponent } from './api-documentation.component';

export const defaultDocGuard: CanActivateFn = () => {
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const docs = inject(eoApiEnvironmentToken).documentation;

  router.navigate([transloco.getActiveLang(), 'documentation', docs[0].id]);

  return false;
}

export const eoApiDocumentationRoutes: Routes = [
  {
    path: '',
    component: EoApiDocumentationComponent,
    children: [
      {
        path: ':doc-id',
        component: EoMarkdownComponent
      },
      {
        path: '**',
        component: EoMarkdownComponent,
        canActivate: [defaultDocGuard]
      }
    ]
  },
];



