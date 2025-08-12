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
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Permission } from '@energinet-datahub/dh/shared/domain';

import { DhActorTokenService } from './dh-actor-token.service';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

type Claims = { [name: string]: unknown };

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly actorTokenService = inject(DhActorTokenService);

  public hasPermission(permission: Permission) {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const claims = this.parseClaims(internalToken);
        if (permission === 'fas') {
          return this.acquireMultiTenancy(claims);
        }
        const roles = this.acquireRoles(claims);
        return roles.includes(permission);
      })
    );
  }

  public hasMarketRole(marketRole: EicFunction) {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const claims = this.parseClaims(internalToken);
        const roles = this.acquireMarketRoles(claims);
        return roles.includes(marketRole);
      })
    );
  }

  public hasMarketParticipantAccess(marketParticipantId: string) {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const claims = this.parseClaims(internalToken);
        const tokenActorId = this.acquireActorId(claims);
        const multitenancy = this.acquireMultiTenancy(claims);
        return tokenActorId === marketParticipantId || multitenancy;
      })
    );
  }

  public isFas() {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const claims = this.parseClaims(internalToken);
        return this.acquireMultiTenancy(claims);
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

  private acquireMarketRoles(claims: Claims): EicFunction[] {
    const roles = claims['marketroles'] as EicFunction[];
    return roles || [];
  }

  private parseClaims(accessToken: string) {
    const jwtParts = accessToken.split('.');
    const jwtPayload = jwtParts[1];
    const claims = window.atob(jwtPayload);
    return JSON.parse(claims);
  }
}
