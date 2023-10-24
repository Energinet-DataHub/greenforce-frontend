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
import { Route } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  WHOLESALE_CALCULATIONS_PATH,
  WHOLESALE_SETTLEMENT_REPORTS_PATH,
  WHOLESALE_REQUEST_CALCULATION_PATH,
} from '@energinet-datahub/dh/wholesale/routing';

export const dhWholesaleShellRoutes: Route[] = [
  {
    path: WHOLESALE_REQUEST_CALCULATION_PATH,
    canActivate: [PermissionGuard(['request-aggregated-measured-data:view'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-request-calculation'),
    data: {
      titleTranslationKey: 'wholesale.requestCalculation.topBarTitle',
    },
  },
  {
    path: WHOLESALE_CALCULATIONS_PATH,
    canActivate: [PermissionGuard(['calculations:manage'])],
    loadComponent: () => import('@energinet-datahub/dh/wholesale/feature-calculations'),
    data: {
      titleTranslationKey: 'wholesale.calculations.topBarTitle',
    },
  },
  {
    path: WHOLESALE_SETTLEMENT_REPORTS_PATH,
    canActivate: [PermissionGuard(['settlement-reports:manage'])],
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-settlement-reports').then(
        (m) => m.DhWholesaleSettlementsReportsTabComponent
      ),
    data: {
      titleTranslationKey: 'wholesale.settlementReports.topBarTitle',
    },
  },
];
