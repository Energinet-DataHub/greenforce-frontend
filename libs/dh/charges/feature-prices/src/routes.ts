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
import { ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

export const chargeSeriesRoutes: Routes = [
  {
    path: getPath<ChargesSubPaths>('prices'),
    canActivate: [PermissionGuard(['charges:view']), dhReleaseToggleGuard('PM58-PRICES-UI')],
    loadComponent: () => import('./components/series/page').then((m) => m.DhChargeSeriesPage),
    children: [
      {
        path: 'day',
        loadComponent: () =>
          import('./components/series/tables/day').then((m) => m.DhChargeSeriesDay),
      },
      {
        path: 'week',
        loadComponent: () =>
          import('./components/series/tables/week').then((m) => m.DhChargeSeriesWeek),
      },
      {
        path: 'month',
        loadComponent: () =>
          import('./components/series/tables/month').then((m) => m.DhChargeSeriesMonth),
      },
      {
        path: 'year',
        loadComponent: () =>
          import('./components/series/tables/year').then((m) => m.DhChargeSeriesYear),
      },
    ],
  },
  {
    path: getPath<ChargesSubPaths>('information'),
    canActivate: [PermissionGuard(['charges:view']), dhReleaseToggleGuard('PM58-PRICES-UI')],
    loadComponent: () =>
      import('./components/information.component').then((m) => m.DhPriceInformationComponent),
  },
  {
    path: getPath<ChargesSubPaths>('history'),
    canActivate: [PermissionGuard(['charges:view']), dhReleaseToggleGuard('PM58-PRICES-UI')],
    loadComponent: () =>
      import('./components/information-history.component').then(
        (m) => m.DhPriceInformationHistoryComponent
      ),
  },
];
