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
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { concatAll, from, map, Observable, reduce } from 'rxjs';

import { PermissionService } from './permission.service';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

export function MarketRoleGuard(marketRole: EicFunction[]): CanActivateFn {
  return (): Observable<boolean | UrlTree> => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    return marketRoleGuardCore(marketRole, permissionService).pipe(
      map((hasMarketRole) => hasMarketRole || router.parseUrl('/'))
    );
  };
}

export function marketRoleGuardCore(
  marketRoles: EicFunction[],
  permissionService: PermissionService
) {
  return from(marketRoles).pipe(
    map((role) => permissionService.hasMarketRole(role)),
    concatAll(),
    // Roles are ORed together.
    reduce((hasRole, next) => hasRole || next)
  );
}
