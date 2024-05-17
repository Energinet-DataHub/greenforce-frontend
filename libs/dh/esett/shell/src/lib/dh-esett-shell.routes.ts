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
import { Routes } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhESettShellComponent } from './dh-esett-shell.component';

import { type ESettSubPaths, getPath } from '@energinet-datahub/dh/shared/routing';

export const dhESettShellRoutes: Routes = [
  {
    path: '',
    component: DhESettShellComponent,
    canActivate: [PermissionGuard(['esett-exchange:manage'])],
    data: {
      titleTranslationKey: 'eSett.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<ESettSubPaths>('outgoing-messages'),
      },
      {
        path: getPath<ESettSubPaths>('outgoing-messages'),
        loadComponent: () => import('@energinet-datahub/dh/esett/feature-outgoing-messages'),
      },
      {
        path: getPath<ESettSubPaths>('metering-gridarea-imbalance'),
        loadComponent: () =>
          import('@energinet-datahub/dh/esett/feature-metering-gridarea-imbalance'),
      },
      {
        path: getPath<ESettSubPaths>('balance-responsible'),
        loadComponent: () => import('@energinet-datahub/dh/esett/feature-balance-responsible'),
      },
    ],
  },
];
