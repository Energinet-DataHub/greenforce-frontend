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
import { RedirectFunction, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';

import {
  MarketRoleGuard,
  PermissionGuard,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  BasePaths,
  getPath,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

import { DhSearchComponent } from './components/dh-search.component';
import { dhMeteringPointIdParam } from './components/dh-metering-point-id-param';
import { dhCanActivateMeteringPointOverview } from './components/dh-can-activate-metering-point-overview';

const marketRolesWithDataAccess = [
  EicFunction.EnergySupplier,
  EicFunction.DanishEnergyAgency,
  EicFunction.GridAccessProvider,
  EicFunction.DataHubAdministrator,
  EicFunction.SystemOperator,
];

export const dhMeteringPointRoutes: Routes = [
  {
    path: '',
    canActivate: [
      PermissionGuard(['metering-point:search'], getPath<BasePaths>('message-archive')),
    ],
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
            redirectTo: redirectToLandingPage(),
          },
          {
            path: getPath<MeteringPointSubPaths>('master-data'),
            canActivate: [MarketRoleGuard(marketRolesWithDataAccess)],
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeteringPointMasterDataComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('process-overview'),
            loadChildren: () => import('@energinet-datahub/dh/metering-point/feature-process-overview'),
          },
          {
            path: getPath<MeteringPointSubPaths>('messages'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeteringPointMessagesComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('failed-measurements'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeteringPointFailedMeasurementsComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('measurements'),
            canActivate: [MarketRoleGuard(marketRolesWithDataAccess)],
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-measurements').then(
                (m) => m.DhMeasurementsNavigationComponent
              ),
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: getPath<MeasurementsSubPaths>('month'),
              },
              {
                path: getPath<MeasurementsSubPaths>('day'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-measurements').then(
                    (m) => m.DhMeasurementsDayComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('month'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-measurements').then(
                    (m) => m.DhMeasurementsMonthComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('year'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-measurements').then(
                    (m) => m.DhMeasurementsYearComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('all'),
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-measurements').then(
                    (m) => m.DhMeasurementsAllYearsComponent
                  ),
              },
              {
                path: getPath<MeasurementsSubPaths>('upload'),
                canActivate: [
                  PermissionGuard(['measurements:manage']),
                  dhReleaseToggleGuard('PM96-SHAREMEASUREDATA'),
                ],
                loadComponent: () =>
                  import('@energinet-datahub/dh/metering-point/feature-upload-measurements').then(
                    (m) => m.DhUploadMeasurementsPage
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Function used to determine the landing page after navigating to '/metering-point/<id>' URL.
 *
 * If the user has the market role to access 'master-data' they are redirected to '/master-data'.
 * Otherwise, the user is redirected to '/messages'.
 */
function redirectToLandingPage(): RedirectFunction {
  return ({ params }) => {
    const router = inject(Router);
    const permissionService = inject(PermissionService);

    const hasMarketRoles$ = forkJoin(
      marketRolesWithDataAccess.map((role) => permissionService.hasMarketRole(role))
    );

    const meteringPointId = params[dhMeteringPointIdParam];

    return hasMarketRoles$.pipe(
      map((hasMarketRoles) => {
        if (hasMarketRoles.includes(true)) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('metering-point'),
            meteringPointId,
            getPath<MeteringPointSubPaths>('master-data'),
          ]);
        }

        return router.createUrlTree([
          '/',
          getPath<BasePaths>('metering-point'),
          meteringPointId,
          getPath<MeteringPointSubPaths>('messages'),
        ]);
      })
    );
  };
}
