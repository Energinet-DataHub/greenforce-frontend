import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';

import { AdminSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhAdminShellComponent } from './dh-admin-shell.component';

const detailsPath = 'details/:id';
const editPath = 'edit';

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
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-user-management-new').then(
                (m) => m.DhUserDetailsComponent
              ),
            children: [
              {
                path: editPath,
                loadComponent: () =>
                  import('@energinet-datahub/dh/admin/feature-user-management-new').then(
                    (m) => m.DhEditUserComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: getPath<AdminSubPaths>('users'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-management'),
      },
      {
        path: getPath<AdminSubPaths>('roles'),
        canMatch: [accessNewUserManagement],
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-roles-new'),
        children: [
          {
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-user-roles-new').then(
                (m) => m.DhUserRoleDetailsComponent
              ),
            children: [
              {
                path: editPath,
                loadComponent: () =>
                  import('@energinet-datahub/dh/admin/feature-user-roles-new').then(
                    (m) => m.DhUserRoleEditComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: getPath<AdminSubPaths>('roles'),
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-user-roles'),
      },
      {
        path: getPath<AdminSubPaths>('permissions'),
        canActivate: [PermissionGuard(['fas'])],
        canMatch: [accessNewUserManagement],
        loadComponent: () => import('@energinet-datahub/dh/admin/feature-permissions-new'),
        children: [
          {
            path: detailsPath,
            loadComponent: () =>
              import('@energinet-datahub/dh/admin/feature-permissions-new').then(
                (m) => m.DhPermissionDetailComponent
              ),
            children: [
              {
                path: editPath,
                loadComponent: () =>
                  import('@energinet-datahub/dh/admin/feature-permissions-new').then(
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
