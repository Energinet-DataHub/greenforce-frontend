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
import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

import { WholesaleSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhWholesaleShellRoutes: Route[] = [
  {
    path: getPath<WholesaleSubPaths>('request-calculation'),
    canActivate: [
      PermissionGuard([
        'request-aggregated-measured-data:view',
        'request-wholesale-settlement:view',
      ]),
    ],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-request-calculation'),
    data: {
      titleTranslationKey: 'wholesale.requestCalculation.topBarTitle',
    },
  },
  {
    path: getPath<WholesaleSubPaths>('calculations'),
    canActivate: [PermissionGuard(['calculations:manage'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-calculations'),
    data: {
      titleTranslationKey: 'wholesale.calculations.topBarTitle',
    },
  },
  {
    path: getPath<WholesaleSubPaths>('settlement-reports-v2'),
    canMatch: [() => inject(DhFeatureFlagsService).isEnabled('settlement-reports-v2')],
    canActivate: [PermissionGuard(['settlement-reports:manage'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-settlement-reports-v2'),
    data: {
      titleTranslationKey: 'wholesale.settlementReportsV2.topBarTitle',
    },
  },
  {
    path: getPath<WholesaleSubPaths>('settlement-reports'),
    canActivate: [PermissionGuard(['settlement-reports:manage'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-settlement-reports'),
    data: {
      titleTranslationKey: 'wholesale.settlementReports.topBarTitle',
    },
  },
];
