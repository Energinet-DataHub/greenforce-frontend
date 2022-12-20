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
import { CanActivateFn } from '@angular/router';
import { PermissionService } from './permission.service';
import { Permission } from '@energinet-datahub/dh/shared/domain';
import { concatAll, from, map, reduce } from 'rxjs';

export function PermissionGuard(permissions: Permission[]): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    return permissionGuardCore(permissions, permissionService);
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
