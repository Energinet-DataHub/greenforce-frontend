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
  Router,
  Routes,
  ResolveFn,
  CanActivateFn,
  RedirectFunction,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';

import {
  MarketRoleGuard,
  PermissionGuard,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import {
  getPath,
  BasePaths,
  combinePaths,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';

import {
  EicFunction,
  DoesInternalMeteringPointIdExistDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

import {
  dhMeteringPointTypeParam,
  dhInternalMeteringPointIdParam,
} from './components/dh-metering-point-params';

import { DhSearchComponent } from './components/dh-search.component';
import { DhCreateMeteringPoint } from './components/dh-create-metering-point.component';
import { dhSupportedMeteringPointTypes } from './components/dh-supported-metering-point-types';
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
        path: getPath<MeteringPointSubPaths>('create'),
        canActivate: [
          dhReleaseToggleGuard('PM52-CREATE-METERING-POINT-UI'),
          PermissionGuard(['metering-point:create']),
          meteringPointCreateGuard(),
        ],
        component: DhCreateMeteringPoint,
      },
      {
        path: `:${dhInternalMeteringPointIdParam}`,
        canActivate: [dhCanActivateMeteringPointOverview],
        resolve: {
          meteringPointId: internalIdToMeteringPointIdResolver(),
        },
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
            loadChildren: () =>
              import('@energinet-datahub/dh/metering-point/feature-process-overview'),
          },
          {
            path: getPath<MeteringPointSubPaths>('charge-links'),
            loadChildren: () => import('@energinet-datahub/dh/metering-point/feature-chargelink'),
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
            ],
          },
          {
            path: combinePaths(
              getPath<MeteringPointSubPaths>('measurements'),
              getPath<MeasurementsSubPaths>('upload'),
              false
            ),
            canActivate: [
              PermissionGuard(['measurements:manage']),
              dhReleaseToggleGuard('PM96-SHAREMEASUREDATA'),
            ],
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-upload-measurements').then(
                (m) => m.DhUploadMeasurementsPage
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('update-customer-details'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-move-in').then(
                (m) => m.DhUpdateCustomerDataComponent
              ),
          },
          {
            path: getPath<MeteringPointSubPaths>('actor-conversation'),
            loadComponent: () =>
              import('@energinet-datahub/dh/metering-point/feature-actor-conversation').then(
                (m) => m.DhActorConversationShellComponent
              ),
          },
        ],
      },
    ],
  },
];

/**
 * Determines the landing page after navigating to '/metering-point/<internal-id>' URL.
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

    const internalMeteringPointId = params[dhInternalMeteringPointIdParam];

    return hasMarketRoles$.pipe(
      map((hasMarketRoles) => {
        if (hasMarketRoles.includes(true)) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('metering-point'),
            internalMeteringPointId,
            getPath<MeteringPointSubPaths>('master-data'),
          ]);
        }

        return router.createUrlTree([
          '/',
          getPath<BasePaths>('metering-point'),
          internalMeteringPointId,
          getPath<MeteringPointSubPaths>('messages'),
        ]);
      })
    );
  };
}

function meteringPointCreateGuard(): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const searchRoute = inject(Router).createUrlTree([
      getPath<BasePaths>('metering-point'),
      getPath<MeteringPointSubPaths>('search'),
    ]);

    const type = route.queryParamMap.get(dhMeteringPointTypeParam);

    if (!type) return searchRoute;

    const isSupportedType = dhSupportedMeteringPointTypes.includes(
      type as (typeof dhSupportedMeteringPointTypes)[number]
    );

    return isSupportedType || searchRoute;
  };
}

/**
 * Resolves the metering point ID from the internal metering point ID.
 */
function internalIdToMeteringPointIdResolver(): ResolveFn<string> {
  return (route: ActivatedRouteSnapshot) => {
    const idParam: string = route.params[dhInternalMeteringPointIdParam];

    return query(DoesInternalMeteringPointIdExistDocument, {
      variables: { internalMeteringPointId: idParam },
    })
      .result()
      .then((result) => result.data.meteringPointExists.meteringPointId);
  };
}
