import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { concatAll, from, map, reduce } from 'rxjs';

import { Permission } from '@energinet-datahub/dh/shared/domain';

import { PermissionService } from './permission.service';

export function PermissionGuard(permissions: Permission[]): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    return permissionGuardCore(permissions, permissionService).pipe(
      map((hasPermission) => hasPermission || router.parseUrl('/'))
    );
  };
}

export function permissionGuardCore(
  permissions: Permission[],
  permissionService: PermissionService
) {
  return from(permissions).pipe(
    map((perm) => permissionService.hasPermission(perm)),
    concatAll(),
    // Permissions are ORed together.
    reduce((hasPermission, next) => hasPermission || next)
  );
}
