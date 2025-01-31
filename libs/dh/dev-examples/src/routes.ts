//#region License
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
//#endregion

import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { DevExamplesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

const detailsPath = 'details/:id';

export const devExampleRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<DevExamplesSubPaths>('processes'),
      },
      {
        path: getPath<DevExamplesSubPaths>('processes'),
        data: {
          titleTranslationKey: 'devExamples.topBarTitle',
        },
        loadComponent: () => import('@energinet-datahub/dh/dev-examples/feature-processes'),
        canActivate: [MsalGuard, PermissionGuard(['fas'])],
        children: [
          {
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/dev-examples/feature-processes').then(
                (m) => m.DhProcessDetailsComponent
              ),
          },
        ],
      },
    ],
  },
];
