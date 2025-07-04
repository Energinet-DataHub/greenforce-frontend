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
import { MsalGuard } from '@azure/msal-angular';
import { Routes } from '@angular/router';

import { DhCoreShellComponent } from './dh-core-shell.component';
import { DhCoreLoginComponent } from './dh-core-login.component';

import { BasePaths, ReportsSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

export const dhCoreShellRoutes: Routes = [
  {
    path: '',
    component: DhCoreShellComponent,
    children: [
      {
        path: '',
        redirectTo: getPath<BasePaths>('message-archive'),
        pathMatch: 'full',
      },
      {
        path: getPath<BasePaths>('message-archive'),
        loadChildren: () => import('@energinet-datahub/dh/message-archive/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('metering-point'),
        loadChildren: () => import('@energinet-datahub/dh/metering-point/feature-search'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('esett'),
        loadChildren: () => import('@energinet-datahub/dh/esett/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('imbalance-prices-deprecated'),
        loadChildren: () =>
          import('@energinet-datahub/dh/imbalance-prices/shell').then(
            (m) => m.dhImbalancePricesShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('imbalance-prices'),
        redirectTo: `${getPath<BasePaths>('reports')}/${getPath<ReportsSubPaths>('settlements')}/${getPath<ReportsSubPaths>('imbalance-prices')}`,
      },
      {
        path: getPath<BasePaths>('metering-point-debug'),
        loadChildren: () => import('@energinet-datahub/dh/metering-point/feature-debug'),
        canActivate: [MsalGuard, PermissionGuard(['fas'])],
      },
      {
        path: getPath<BasePaths>('dev-examples'),
        loadChildren: () => import('@energinet-datahub/dh/dev-examples/feature-processes'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('reports'),
        loadChildren: () => import('@energinet-datahub/dh/reports/feature-reports'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('market-participant'),
        loadChildren: () => import('@energinet-datahub/dh/market-participant/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('grid-areas-deprecated'),
        loadComponent: () =>
          import('@energinet-datahub/dh/market-participant/grid-areas').then(
            (m) => m.DhGridAreasDeprecated
          ),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('grid-areas'),
        loadComponent: () => import('@energinet-datahub/dh/market-participant/grid-areas'),
        data: {
          titleTranslationKey: 'marketParticipant.gridAreas.topBarTitle',
        },
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('wholesale'),
        loadChildren: () => import('@energinet-datahub/dh/wholesale/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('admin-deprecated'),
        loadComponent: () =>
          import('@energinet-datahub/dh/admin/shell').then((m) => m.DhAdminShellDeprecated),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('admin'),
        loadChildren: () => import('@energinet-datahub/dh/admin/shell'),
        canActivate: [MsalGuard],
      },
    ],
  },
  {
    path: getPath<BasePaths>('login'),
    pathMatch: 'full',
    component: DhCoreLoginComponent,
  },
];
