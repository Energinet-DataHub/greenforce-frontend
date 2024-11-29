import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Permission } from '@energinet-datahub/dh/shared/domain';

import { DhActorTokenService } from './dh-actor-token.service';

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

  private parseClaims(accessToken: string) {
    const jwtParts = accessToken.split('.');
    const jwtPayload = jwtParts[1];
    const claims = window.atob(jwtPayload);
    return JSON.parse(claims);
  }
}
