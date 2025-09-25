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
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { BasePaths, MeteringPointSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

export const dhDefaultRouteGuard = () => {
  const router = inject(Router);
  const permissionService = inject(PermissionService);

  return permissionService.hasPermission('metering-point:search').pipe(
    map((hasPermission) => {
      if (hasPermission) {
        // User has permission to access metering-point search
        return router.createUrlTree([
          getPath<BasePaths>('metering-point'),
          getPath<MeteringPointSubPaths>('search'),
        ]);
      } else {
        // User doesn't have permission, redirect to message-archive
        return router.createUrlTree([getPath<BasePaths>('message-archive')]);
      }
    })
  );
};
