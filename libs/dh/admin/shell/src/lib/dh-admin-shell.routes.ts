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
import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';

import { AdminSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhAdminShellComponent } from './dh-admin-shell.component';

const accessNewUserManagement: CanMatchFn = () => {
  return inject(DhFeatureFlagsService).isEnabled('feature-user-management-new');
};

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
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-management-new'),
        canMatch: [accessNewUserManagement],
        children: [
          {
            path: 'details/:id',
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-user-management-new').then(
                (m) => m.DhUserDetailsComponent
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-user-management-new').then(
                (m) => m.DhEditUserComponent
              ),
          },
        ],
      },
      {
        path: getPath<AdminSubPaths>('users'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-management'),
      },
      {
        path: getPath<AdminSubPaths>('roles'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-roles'),
      },
      {
        path: getPath<AdminSubPaths>('permissions'),
        canActivate: [PermissionGuard(['fas'])],
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-permissions'),
      },
    ],
  },
];
