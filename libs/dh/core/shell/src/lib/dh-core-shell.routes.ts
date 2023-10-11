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

import { dhMarketParticipantPath } from '@energinet-datahub/dh/market-participant/routing';
import { WHOLESALE_BASE_PATH } from '@energinet-datahub/dh/wholesale/routing';
import { dhAdminPath } from '@energinet-datahub/dh/admin/routing';

import { DhCoreShellComponent } from './dh-core-shell.component';

export const dhCoreShellRoutes: Routes = [
  {
    path: '',
    component: DhCoreShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'message-archive',
        pathMatch: 'full',
      },
      {
        path: 'message-archive',
        loadChildren: () =>
          import('@energinet-datahub/dh/message-archive/shell').then(
            (esModule) => esModule.dhMessageArchiveShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: 'esett',
        loadChildren: () => import('@energinet-datahub/dh/esett/shell'),
        canActivate: [MsalGuard],
      },
      {
        path: dhMarketParticipantPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/market-participant/shell').then(
            (esModule) => esModule.dhMarketParticipantShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: WHOLESALE_BASE_PATH,
        loadChildren: () =>
          import('@energinet-datahub/dh/wholesale/shell').then(
            (esModule) => esModule.dhWholesaleShellRoutes
          ),
        canActivate: [MsalGuard],
      },
      {
        path: dhAdminPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/admin/shell').then(
            (esModule) => esModule.dhAdminShellRoutes
          ),
        canActivate: [MsalGuard],
      },
    ],
  },
  // Used by MSAL (B2C)
  { path: 'state', redirectTo: '', pathMatch: 'full' },
];
