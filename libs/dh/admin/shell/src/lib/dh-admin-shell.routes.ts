import { Routes } from '@angular/router';

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhAdminUserManagementPath } from '@energinet-datahub/dh/admin/routing';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: dhAdminUserManagementPath,
  },
  {
    path: dhAdminUserManagementPath,
    loadComponent: () =>
      import('@energinet-datahub/dh/admin/feature-user-management').then(
        (m) => m.DhAdminFeatureUserManagementComponent
      ),
    canActivate: [PermissionGuard(['users:manage'])],
    data: {
      titleTranslationKey: 'admin.userManagement.topBarTitle',
    },
  },
];
