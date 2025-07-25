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
import { Route } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { WholesaleSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhWholesaleShellRoutes: Route[] = [
  {
    path: getPath<WholesaleSubPaths>('requests-deprecated'),
    canActivate: [
      PermissionGuard([
        'request-aggregated-measured-data:view',
        'request-wholesale-settlement:view',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        'calculations:manage',
      ]),
    ],
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-requests').then(
        (m) => m.DhWholesaleRequestsPageDeprecated
      ),
  },
  {
    path: getPath<WholesaleSubPaths>('requests'),
    canActivate: [
      PermissionGuard([
        'request-aggregated-measured-data:view',
        'request-wholesale-settlement:view',
        'calculations:manage',
      ]),
    ],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-requests'),
    data: {
      titleTranslationKey: 'wholesale.requests.topBarTitle',
    },
  },
  {
    path: getPath<WholesaleSubPaths>('calculations-deprecated'),
    canActivate: [PermissionGuard(['calculations:view'])],
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-calculations').then(
        (m) => m.DhCalculationsDeprecated
      ),
  },
  {
    path: getPath<WholesaleSubPaths>('calculations'),
    canActivate: [PermissionGuard(['calculations:view'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-calculations'),
    data: {
      titleTranslationKey: 'wholesale.calculations.topBarTitle',
    },
    children: [
      {
        path: 'new',
        canActivate: [PermissionGuard(['calculations:manage'])],
        loadComponent: () =>
          import('@energinet-datahub/dh/wholesale/feature-calculations').then(
            (m) => m.DhCalculationsCreateComponent
          ),
      },
    ],
  },
];
