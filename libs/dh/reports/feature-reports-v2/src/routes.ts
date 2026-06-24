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
  BasePaths,
  ReportsSubPaths,
  getPath,
} from '@energinet-datahub/dh/core/configuration-routing';
import {
  PermissionGuard,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  dhReleaseToggleGuard,
  DhReleaseToggleService,
} from '@energinet-datahub/dh/shared/util-release-toggle';

import { DhReportsV2 } from './reports-v2.component';
import { DhReportsOverview } from './reports-overview';

export const routes: Routes = [
  {
    path: '',
    component: DhReportsV2,
    data: {
      titleTranslationKey: 'reports.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: redirectToLandingPage(),
      },
      {
        path: getPath<ReportsSubPaths>('settlement-reports'),
        canActivate: [PermissionGuard(['settlement-reports:manage'])],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-settlement-reports'),
      },
      {
        path: getPath<ReportsSubPaths>('measurements-reports'),
        canActivate: [
          dhReleaseToggleGuard('PM31-REPORTS'),
          PermissionGuard(['measurements-reports:manage']),
        ],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-measurements-reports'),
      },
      {
        path: getPath<ReportsSubPaths>('overview'),
        canActivate: [PermissionGuard(['metering-point-master-data-reports:manage'])],
        component: DhReportsOverview,
      },
      {
        path: getPath<ReportsSubPaths>('imbalance-prices'),
        canActivate: [PermissionGuard(['imbalance-prices:view'])],
        loadComponent: () => import('@energinet-datahub/dh/imbalance-prices'),
      },
      {
        path: getPath<ReportsSubPaths>('missing-measurements-log'),
        canActivate: [
          dhReleaseToggleGuard('MISSINGDATALOG'),
          PermissionGuard(['missing-measurements-log:view']),
        ],
        loadComponent: () =>
          import('@energinet-datahub/dh/reports/feature-missing-measurements-log'),
        children: [
          {
            path: 'request',
            loadComponent: () =>
              import('@energinet-datahub/dh/reports/feature-missing-measurements-log').then(
                (m) => m.DhReportsMissingMeasurementsLogRequestLog
              ),
          },
        ],
      },
    ],
  },
];

/**
 * Function used to determine the landing page after navigating to '/reports' URL.
 */
function redirectToLandingPage(): RedirectFunction {
  return () => {
    const router = inject(Router);
    const permissionService = inject(PermissionService);
    const releaseToggleService = inject(DhReleaseToggleService);

    const hasMeasurementsReportsPermission$ = permissionService.hasPermission(
      'measurements-reports:manage'
    );
    const hasSettlementReportsPermission$ = permissionService.hasPermission(
      'settlement-reports:manage'
    );
    const hasMeteringPointMasterDataReportsPermission$ = permissionService.hasPermission(
      'metering-point-master-data-reports:manage'
    );
    const hasImbalancePricesViewPermission$ =
      permissionService.hasPermission('imbalance-prices:view');
    const hasMissingMeasurementsLogPermission$ = permissionService.hasPermission(
      'missing-measurements-log:view'
    );

    return forkJoin([
      hasMeasurementsReportsPermission$,
      hasSettlementReportsPermission$,
      hasMeteringPointMasterDataReportsPermission$,
      hasImbalancePricesViewPermission$,
      hasMissingMeasurementsLogPermission$,
    ]).pipe(
      map(
        ([
          hasMeasurementsReportsPermission,
          hasSettlementReportsPermission,
          hasMeteringPointMasterDataReportsPermission,
          hasImbalancePricesViewPermission,
          hasMissingMeasurementsLogPermission,
        ]) => {
          if (releaseToggleService.isEnabled('PM31-REPORTS') && hasMeasurementsReportsPermission) {
            return router.createUrlTree([
              '/',
              getPath<BasePaths>('reports'),
              getPath<ReportsSubPaths>('measurements-reports'),
            ]);
          } else if (hasSettlementReportsPermission) {
            return router.createUrlTree([
              '/',
              getPath<BasePaths>('reports'),
              getPath<ReportsSubPaths>('settlement-reports'),
            ]);
          } else if (hasMeteringPointMasterDataReportsPermission) {
            return router.createUrlTree([
              '/',
              getPath<BasePaths>('reports'),
              getPath<ReportsSubPaths>('overview'),
            ]);
          } else if (hasImbalancePricesViewPermission) {
            return router.createUrlTree([
              '/',
              getPath<BasePaths>('reports'),
              getPath<ReportsSubPaths>('imbalance-prices'),
            ]);
          } else if (hasMissingMeasurementsLogPermission) {
            return router.createUrlTree([
              '/',
              getPath<BasePaths>('reports'),
              getPath<ReportsSubPaths>('missing-measurements-log'),
            ]);
          }

          return router.parseUrl('/');
        }
      )
    );
  };
}
