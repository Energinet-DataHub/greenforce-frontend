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
import { DhAdminShellComponent } from './dh-admin-shell.component';

import { AdminSubPaths, getPath } from '@energinet-datahub/dh/shared/routing';

export const dhAdminShellRoutes: Routes = [
  {
    path: '',
    component: DhAdminShellComponent,
    canActivate: [PermissionGuard(['users:manage'])],
    data: {
      titleTranslationKey: 'admin.userManagement.topBarTitle',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: getPath<AdminSubPaths>('user'),
      },
      {
        path: getPath<AdminSubPaths>('user'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-management'),
      },
      {
        path: getPath<AdminSubPaths>('roles'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-roles'),
      },
      {
        path: getPath<AdminSubPaths>('permissions'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-permissions'),
      },
    ],
  },
];
