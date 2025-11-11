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
import { MeteringPointSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhReleaseToggleGuard } from '@energinet-datahub/dh/shared/release-toggle';

export const meteringPointPricesRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: getPath<MeteringPointSubPaths>('prices'),
  },
  {
    canActivate: [
      PermissionGuard(['metering-point:prices']),
      dhReleaseToggleGuard('PM58-PRICES-UI'),
    ],
    path: getPath<MeteringPointSubPaths>('prices'),
    loadComponent: () => import('./components/prices').then((m) => m.DhMeteringPointPrices),
    // children: [
    //   {
    //     path: 'details/:id',
    //     loadComponent: () =>
    //       import('./components/details').then((m) => m.DhMeteringPointPricesDetails),
    //   },
    // ],
  },
];
