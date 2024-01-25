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
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Permission } from '@energinet-datahub/dh/shared/domain';

import { DhActorTokenService } from './dh-actor-token.service';

type Claims = { [name: string]: unknown };

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private actorTokenService: DhActorTokenService) {}

  public hasPermission(permission: Permission) {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const claims = this.parseClaims(internalToken);
        const roles = this.acquireRoles(claims);
        return roles.includes(permission);
      })
    );
  }

  public hasActorAccess(actorId: string) {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const claims = this.parseClaims(internalToken);
        const tokenActorId = this.acquireActorId(claims);
        const multitenancy = this.acquireMultiTenancy(claims);
        return tokenActorId === actorId || multitenancy;
      })
    );
  }

  private acquireRoles(claims: Claims): Permission[] {
    const roles = claims['role'] as Permission[];
    return roles || [];
  }

  private acquireActorId(claims: Claims): string {
    return claims['azp'] as string;
  }

  private acquireMultiTenancy(claims: Claims): boolean {
    return claims['multitenancy'] as boolean;
  }

  private parseClaims(accessToken: string) {
    const jwtParts = accessToken.split('.');
    const jwtPayload = jwtParts[1];
    const claims = window.atob(jwtPayload);
    return JSON.parse(claims);
  }
}
