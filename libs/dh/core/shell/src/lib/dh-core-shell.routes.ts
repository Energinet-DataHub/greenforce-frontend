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
import { MsalGuard } from '@azure/msal-angular';
import { Routes } from '@angular/router';

import { DhCoreShellComponent } from './dh-core-shell.component';
import { DhCoreLoginComponent } from './dh-core-login.component';

import { BasePaths, getPath } from '@energinet-datahub/dh/shared/routing';

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
        loadChildren: () =>
          import('@energinet-datahub/dh/message-archive/shell').then(
            (esModule) => esModule.dhMessageArchiveShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('esett'),
        loadChildren: () => import('@energinet-datahub/dh/esett/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('imbalance-prices'),
        loadChildren: () => import('@energinet-datahub/dh/imbalance-prices/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('market-participant'),
        loadChildren: () =>
          import('@energinet-datahub/dh/market-participant/shell').then(
            (esModule) => esModule.dhMarketParticipantShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('grid-areas'),
        loadComponent: () => import('@energinet-datahub/dh/market-participant/grid-areas/shell'),
        data: {
          titleTranslationKey: 'marketParticipant.gridAreas.topBarTitle',
        },
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('wholesale'),
        loadChildren: () =>
          import('@energinet-datahub/dh/wholesale/shell').then(
            (esModule) => esModule.dhWholesaleShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: getPath<BasePaths>('admin'),
        loadChildren: () =>
          import('@energinet-datahub/dh/admin/shell').then(
            (esModule) => esModule.dhAdminShellRoutes
          ),
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
