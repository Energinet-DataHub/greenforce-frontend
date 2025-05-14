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

import { ReportsSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhReports } from './reports.component';
import { FeatureFlagGuard } from '@energinet-datahub/dh/shared/feature-flags';

export const routes: Routes = [
  {
    path: '',
    component: DhReports,
    canActivate: [PermissionGuard(['settlement-reports:manage'])],
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
        canActivate: [PermissionGuard(['settlement-reports:manage'])],
        loadComponent: () => import('@energinet-datahub/dh/reports/feature-settlement-reports'),
      },
    ],
  },
  {
    path: getPath<ReportsSubPaths>('missing-measurements-log'),
    canActivate: [
      FeatureFlagGuard('missing-measurements-log'),
      PermissionGuard(['missing-measurements-log:view']),
    ],
    loadComponent: () => import('@energinet-datahub/dh/reports/feature-missing-measurements-log'),
    data: {
      titleTranslationKey: 'reports.missingMeasurementsLog.topBarTitle',
    },
  },
];
