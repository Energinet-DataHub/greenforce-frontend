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
import { ActorTokenService } from './actor-token.service';
import { Permission } from './permission';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private actorTokenService: ActorTokenService) {}

  public hasPermission(permission: Permission) {
    return this.actorTokenService.acquireToken().pipe(
      map((internalToken) => {
        const roles = this.acquireClaimsFromAccessToken(internalToken);
        return roles.includes(permission);
      })
    );
  }

  private acquireClaimsFromAccessToken(accessToken: string): Permission[] {
    const jwtParts = accessToken.split('.');
    const jwtPayload = jwtParts[1];

    const claims = window.atob(jwtPayload);

    const jwtJson = JSON.parse(claims);
    const roles = jwtJson['role'] as Permission[];

    return roles || [];
  }
}
