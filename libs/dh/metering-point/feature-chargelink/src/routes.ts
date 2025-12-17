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
import { ChargeLinksSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

const detailsRoutes = [
  {
    path: 'details/:id',
    loadComponent: () => import('./components/details'),
    children: [
      {
        path: 'edit',
        loadComponent: () => import('./components/actions/edit'),
      },
      {
        path: 'stop',
        loadComponent: () => import('./components/actions/stop'),
      },
      {
        path: 'cancel',
        loadComponent: () => import('./components/actions/cancel'),
      },
    ],
  },
];

export const meteringPointPricesRoutes: Routes = [
  {
    canActivate: [
      PermissionGuard(['metering-point:prices']),
      dhReleaseToggleGuard('PM60-CHARGE-LINKS-UI'),
    ],
    path: '',
    loadComponent: () => import('./components/page'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<ChargeLinksSubPaths>('tariff-and-subscription'),
      },
      {
        path: getPath<ChargeLinksSubPaths>('tariff-and-subscription'),
        loadComponent: () => import('./components/tariff-subscriptions'),
        children: detailsRoutes,
      },
      {
        path: getPath<ChargeLinksSubPaths>('fees'),
        loadComponent: () => import('./components/fees'),
        children: detailsRoutes,
      },
      {
        path: getPath<ChargeLinksSubPaths>('create'),
        canActivate: [
          PermissionGuard(['metering-point:prices-manage']),
          dhReleaseToggleGuard('PM60-CHARGE-LINKS-UI'),
        ],
        loadComponent: () =>
          import('@energinet-datahub/dh/metering-point/feature-chargelink').then(
            (m) => m.DhMeteringPointCreateChargeLink
          ),
      },
    ],
  },
];
