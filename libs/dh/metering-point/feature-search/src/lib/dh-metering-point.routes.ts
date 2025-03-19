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
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

import { DhSearchComponent } from './dh-search.component';
import { dhMeteringPointIdParam } from './dh-metering-point-id-param';
import { dhCanActivateMeteringPointOverview } from './dh-can-activate-metering-point-overview';

export const dhMeteringPointRoutes: Routes = [
  {
    path: '',
    canActivate: [
      PermissionGuard(['metering-point:search']),
      () =>
        inject(DhFeatureFlagsService).isEnabled('metering-point') || inject(Router).parseUrl('/'),
    ],
    data: {
      titleTranslationKey: 'meteringPoint.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<MeteringPointSubPaths>('search'),
      },
      {
        path: getPath<MeteringPointSubPaths>('search'),
        component: DhSearchComponent,
      },
      {
        path: `:${dhMeteringPointIdParam}`,
        canActivate: [dhCanActivateMeteringPointOverview],
        loadComponent: () => import('@energinet-datahub/dh/metering-point/feature-overview'),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: getPath<MeteringPointSubPaths>('master-data'),
          },
          {
            path: getPath<MeteringPointSubPaths>('master-data'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeteringPointMasterDataComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('meter-data'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeterDataComponent
              ),
          },
        ],
      },
    ],
  },
];
