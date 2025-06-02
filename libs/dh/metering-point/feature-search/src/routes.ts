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
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  Routes,
  UrlTree,
} from '@angular/router';

import {
  MarketRoleGuard,
  PermissionGuard,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  BasePaths,
  getPath,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';

import { DhSearchComponent } from './components/dh-search.component';
import { dhMeteringPointIdParam } from './components/dh-metering-point-id-param';
import { dhCanActivateMeteringPointOverview } from './components/dh-can-activate-metering-point-overview';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';

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
            canActivate: [redirectToLandingPage()],
            // Note: Needed so the `canActivate` guard can be applied to this route config.
            // Intentionally left empty.
            children: [],
          },
          {
            path: getPath<MeteringPointSubPaths>('master-data'),
            canActivate: [
              MarketRoleGuard([
                EicFunction.EnergySupplier,
                EicFunction.DanishEnergyAgency,
                EicFunction.GridAccessProvider,
                EicFunction.DataHubAdministrator,
                EicFunction.SystemOperator,
              ]),
            ],
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeteringPointMasterDataComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('messages'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
                (m) => m.DhMeteringPointMessagesComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('measurements'),
            canActivate: [
              MarketRoleGuard([
                EicFunction.EnergySupplier,
                EicFunction.DanishEnergyAgency,
                EicFunction.GridAccessProvider,
                EicFunction.DataHubAdministrator,
                EicFunction.SystemOperator,
              ]),
            ],
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-overview').then(
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
                    (m) => m.DhMeasurementsAllYearsComponent
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
 * Function used to determine the landing page after navigating to '/reports/overview' URL.
 *
 * If the user has the permission to access 'settlement-reports' they are redirected to '/settlement-reports'.
 * Otherwise, if the user has the permission to access 'measurements-reports', they are redirected to '/measurements-reports'.
 * If neither permission is granted, the user is redirected to the root path ('/').
 *
 * Note: This function is temporary until the project is updated to Angular v20, which supports async redirects.
 * See: https://github.com/angular/angular/pull/60863
 */
function redirectToLandingPage() {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);

    const hasMarketRoles$ = MarketRoleGuard([
      EicFunction.EnergySupplier,
      EicFunction.DanishEnergyAgency,
      EicFunction.GridAccessProvider,
      EicFunction.DataHubAdministrator,
      EicFunction.SystemOperator,
    ])(route, state) as Observable<boolean | UrlTree>;

    const meteringPointId = route.params[dhMeteringPointIdParam];

    return hasMarketRoles$.pipe(
      map((hasMarketRoles) => {
        if (hasMarketRoles === true) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('metering-point'),
            meteringPointId,
            getPath<MeteringPointSubPaths>('master-data'),
          ]);
        } else {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('metering-point'),
            meteringPointId,
            getPath<MeteringPointSubPaths>('messages'),
          ]);
        }
      })
    );
  };
}
