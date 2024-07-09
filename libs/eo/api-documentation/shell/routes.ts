/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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



