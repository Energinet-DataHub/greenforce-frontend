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
import { PermissionService } from './permission-service';
import { UserRole } from './user-roles';

export function PermissionGuard(userRoles: UserRole[]) {
  return () => {
    const permissionService = inject(PermissionService);
    return userRoles.filter(r => permissionService.hasUserRole(r)).length > 0;
  };
}
