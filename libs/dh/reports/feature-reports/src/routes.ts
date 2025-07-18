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
/* eslint-disable sonarjs/no-duplicate-string */

import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  Routes,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { BasePaths, ReportsSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

import { DhReports } from './reports.component';
import { DhSettlements } from './settlements.component';

export const routes: Routes = [
  {
    path: getPath<ReportsSubPaths>('overview'),
    component: DhReports,
    canActivate: [PermissionGuard(['measurements-reports:manage', 'settlement-reports:manage'])],
    data: {
      titleTranslationKey: 'reports.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [redirectToReportsOverviewLandingPage()],
        // Note: Needed so the `canActivate` guard can be applied to this route config.
        // Intentionally left empty.
        children: [],
      },
      {
        path: getPath<ReportsSubPaths>('settlement-reports'),
        redirectTo: `/${getPath<BasePaths>('reports')}/${getPath<ReportsSubPaths>('settlements')}/${getPath<ReportsSubPaths>(
          'settlement-reports'
        )}`,
      },
      {
        path: getPath<ReportsSubPaths>('settlement-reports-deprecated'),
        canActivate: [PermissionGuard(['settlement-reports:manage'])],
        loadComponent: () =>
          import('@energinet-datahub/dh/reports/feature-settlement-reports').then(
            (m) => m.DhSettlementReportsDeprecated
          ),
      },
      {
        path: getPath<ReportsSubPaths>('measurements-reports'),
        canActivate: [
          dhReleaseToggleGuard('PM31-REPORTS'),
          PermissionGuard(['measurements-reports:manage']),
        ],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-measurements-reports'),
      },
    ],
  },
  {
    path: getPath<ReportsSubPaths>('settlements'),
    component: DhSettlements,
    data: {
      titleTranslationKey: 'reports.settlements.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [redirectToSettlementsLandingPage()],
        // Note: Needed so the `canActivate` guard can be applied to this route config.
        // Intentionally left empty.
        children: [],
      },
      {
        path: getPath<ReportsSubPaths>('settlement-reports'),
        canActivate: [PermissionGuard(['settlement-reports:manage'])],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-settlement-reports'),
      },
      {
        path: getPath<BasePaths>('imbalance-prices'),
        canActivate: [PermissionGuard(['imbalance-prices:view'])],
        loadComponent: () => import('@energinet-datahub/dh/imbalance-prices/shell'),
      },
    ],
  },
  {
    path: getPath<ReportsSubPaths>('missing-measurements-log'),
    canActivate: [
      dhReleaseToggleGuard('MISSINGDATALOG'),
      PermissionGuard(['missing-measurements-log:view']),
    ],
    loadComponent: () => import('@energinet-datahub/dh/reports/feature-missing-measurements-log'),
    data: {
      titleTranslationKey: 'reports.missingMeasurementsLog.topBarTitle',
    },
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
];

/**
 * Function used to determine the landing page after navigating to '/reports/overview' URL.
 *
 * If the user has the permission to access 'settlement-reports' they are redirected to './settlement-reports'.
 * Otherwise, if the user has the permission to access 'measurements-reports', they are redirected to './measurements-reports'.
 * If neither permission is granted, the user is redirected to the root path ('/').
 *
 * Note: This function is temporary until the project is updated to Angular v20, which supports async redirects.
 * See: https://github.com/angular/angular/pull/60863
 */
function redirectToReportsOverviewLandingPage() {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);

    const hasSettlementReportsPermission$ = PermissionGuard(['settlement-reports:manage'])(
      route,
      state
    ) as Observable<boolean | UrlTree>;

    const hasMeasurementsReportsPermission$ = PermissionGuard(['measurements-reports:manage'])(
      route,
      state
    ) as Observable<boolean | UrlTree>;

    return forkJoin([hasSettlementReportsPermission$, hasMeasurementsReportsPermission$]).pipe(
      map(([hasSettlementReportsPermission, hasMeasurementsReportsPermission]) => {
        if (hasSettlementReportsPermission === true) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('reports'),
            getPath<ReportsSubPaths>('overview'),
            getPath<ReportsSubPaths>('settlement-reports-deprecated'),
          ]);
        } else if (hasMeasurementsReportsPermission === true) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('reports'),
            getPath<ReportsSubPaths>('overview'),
            getPath<ReportsSubPaths>('measurements-reports'),
          ]);
        }

        return router.parseUrl('/');
      })
    );
  };
}

/**
 * Function used to determine the landing page after navigating to '/reports/settlements' URL.
 *
 * If the user has the permission to access 'settlement-reports' they are redirected to './settlement-reports'.
 * Otherwise, if the user has the permission to access 'imbalance-prices', they are redirected to './imbalance-prices'.
 * If neither permission is granted, the user is redirected to the root path ('/').
 *
 * Note: This function is temporary until the project is updated to Angular v20, which supports async redirects.
 * See: https://github.com/angular/angular/pull/60863
 */
function redirectToSettlementsLandingPage() {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);

    const hasSettlementReportsPermission$ = PermissionGuard(['settlement-reports:manage'])(
      route,
      state
    ) as Observable<boolean | UrlTree>;

    const hasImbalancePricesViewPermission$ = PermissionGuard(['imbalance-prices:view'])(
      route,
      state
    ) as Observable<boolean | UrlTree>;

    return forkJoin([hasSettlementReportsPermission$, hasImbalancePricesViewPermission$]).pipe(
      map(([hasSettlementReportsPermission, hasImbalancePricesViewPermission]) => {
        if (hasSettlementReportsPermission === true) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('reports'),
            getPath<ReportsSubPaths>('settlements'),
            getPath<ReportsSubPaths>('settlement-reports'),
          ]);
        } else if (hasImbalancePricesViewPermission === true) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('reports'),
            getPath<ReportsSubPaths>('settlements'),
            getPath<ReportsSubPaths>('imbalance-prices'),
          ]);
        }

        return router.parseUrl('/');
      })
    );
  };
}
