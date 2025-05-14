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

import { DhReports } from './reports.component';

export const routes: Routes = [
  {
    path: '',
    component: DhReports,
    canActivate: [PermissionGuard(['fas', 'settlement-reports:manage'])],
    data: {
      titleTranslationKey: 'reports.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<ReportsSubPaths>('settlement-reports'),
      },
      {
        path: getPath<ReportsSubPaths>('settlement-reports'),
        canActivate: [figureOutLandingPageAfterRedirect()],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-settlement-reports'),
      },
      {
        path: getPath<ReportsSubPaths>('measurement-reports'),
        canActivate: [PermissionGuard(['fas'])],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-measurement-reports'),
      },
    ],
  },
];

/**
 * This function is used to determine the landing page after a redirect to 'settlement-reports'.
 *
 * If the user has the permission to access 'settlement-reports' they are allowed to do so.
 * Otherwise, if the user has the 'fas' permission, they are redirected to 'measurement-reports'.
 * If neither permission is granted, the user is redirected to the root path ('/').
 *
 * Note: This function is temporary until the project is updated to Angular v20, which supports async redirects.
 * See: https://github.com/angular/angular/pull/60863
 */
function figureOutLandingPageAfterRedirect() {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);

    const hasSettlementReportsPermission$ = PermissionGuard(['settlement-reports:manage'])(
      route,
      state
    ) as Observable<boolean | UrlTree>;

    const isFas$ = PermissionGuard(['fas'])(route, state) as Observable<boolean | UrlTree>;

    return forkJoin([hasSettlementReportsPermission$, isFas$]).pipe(
      map(([hasSettlementReportsPermission, isFas]) => {
        if (hasSettlementReportsPermission === true) {
          return true;
        } else if (isFas === true) {
          return router.createUrlTree([
            '/',
            getPath<BasePaths>('reports'),
            getPath<ReportsSubPaths>('measurement-reports'),
          ]);
        }

        return router.parseUrl('/');
      })
    );
  };
}
