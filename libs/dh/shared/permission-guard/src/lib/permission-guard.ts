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

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { PermissionService } from './permission-service';
import { Permission } from './permissions';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const requiredPermission = route.data.requiredPermission;
    if (requiredPermission) {
      return this.permissionService.hasPermission(requiredPermission);
    }

    // If a permission guard has been set up, but 'requiredPermission' was not specified,
    // it is assumed that the intent was to protect access and the route is blocked.
    return false;
  }
}

export function PermissionGuard2(permission: Permission[])
{
  return (route: ActivatedRouteSnapshot) => {

    const permissionService = inject(PermissionService);

    const requiredPermission = route.data.requiredPermission;
    if (requiredPermission) {
      return permissionService.hasPermission(requiredPermission);
    }

    // If a permission guard has been set up, but 'requiredPermission' was not specified,
    // it is assumed that the intent was to protect access and the route is blocked.
    return false;
  }
}
