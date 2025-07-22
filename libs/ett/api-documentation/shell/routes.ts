
import { CanActivateFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { EttMarkdownComponent } from '@energinet-datahub/ett/api-documentation/markdown';

import { EttApiDocumentationComponent } from './api-documentation.component';

export const defaultDocGuard: CanActivateFn = () => {
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const docs = inject(ettApiEnvironmentToken).documentation;

  router.navigate([transloco.getActiveLang(), 'documentation', docs[0].id]);

  return false;
}

export const ettApiDocumentationRoutes: Routes = [
  {
    path: '',
    component: EttApiDocumentationComponent,
    children: [
      {
        path: ':doc-id',
        component: EttMarkdownComponent
      },
      {
        path: '**',
        component: EttMarkdownComponent,
        canActivate: [defaultDocGuard]
      }
    ]
  },
];



