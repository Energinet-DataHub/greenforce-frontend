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

import { AdminSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhAdminShellComponent } from './dh-admin-shell.component';

const detailsPath = 'details/:id';
const editPath = 'edit';

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
        redirectTo: getPath<AdminSubPaths>('users'),
      },
      {
        path: getPath<AdminSubPaths>('users'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-management'),
        children: [
          {
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-user-management').then(
                (m) => m.DhUserDetailsComponent
              ),
            children: [
              {
                path: editPath,
                loadComponent: () =>
                  import('@energinet-datahub/dh/admin/feature-user-management').then(
                    (m) => m.DhEditUserComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: getPath<AdminSubPaths>('roles'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-roles'),
        children: [
          {
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-user-roles').then(
                (m) => m.DhUserRoleDetailsComponent
              ),
            children: [
              {
                path: editPath,
                loadComponent: () =>
                  import('@energinet-datahub/dh/admin/feature-user-roles').then(
                    (m) => m.DhUserRoleEditComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: getPath<AdminSubPaths>('permissions'),
        canActivate: [PermissionGuard(['fas'])],
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-permissions'),
        children: [
          {
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-permissions').then(
                (m) => m.DhPermissionDetailComponent
              ),
            children: [
              {
                path: editPath,
                loadComponent: () =>
                  import('@energinet-datahub/dh/admin/feature-permissions').then(
                    (m) => m.DhPermissionEditComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: getPath<AdminSubPaths>('permissions'),
        canActivate: [PermissionGuard(['fas'])],
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-permissions'),
      },
    ],
  },
];
