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
import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  getPath,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';

import { DhSearchComponent } from './components/dh-search.component';
import { dhMeteringPointIdParam } from './components/dh-metering-point-id-param';
import { dhCanActivateMeteringPointOverview } from './components/dh-can-activate-metering-point-overview';

export const dhMeteringPointRoutes: Routes = [
  {
    path: '',
    canActivate: [PermissionGuard(['metering-point:search'])],
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
            path: getPath<MeteringPointSubPaths>('measurements'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeasurementsNavigationComponent
              ),
            canMatch: [() => inject(DhFeatureFlagsService).isEnabled('measurements-v2')],
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: getPath<MeasurementsSubPaths>('day'),
              },
              {
                path: getPath<MeasurementsSubPaths>('day'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-overview').then(
                    (m) => m.DhMeasurementsDayComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('month'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-overview').then(
                    (m) => m.DhMeasurementsMonthComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('year'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-overview').then(
                    (m) => m.DhMeasurementsYearComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('all'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-overview').then(
                    (m) => m.DhMeasurementsAllYearComponent
                  ),
              },
            ],
          },
          {
            path: getPath<MeteringPointSubPaths>('measurements'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeasurementsComponent
              ),
          },
        ],
      },
    ],
  },
];
