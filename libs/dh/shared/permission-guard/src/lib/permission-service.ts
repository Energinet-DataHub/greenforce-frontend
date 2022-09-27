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
import { MsalService } from '@azure/msal-angular';
import { UserRole } from './user-roles';

const roleClaimName = "extension_roles"

@Injectable()
export class PermissionService {
  constructor(private authService: MsalService) {}

  public hasUserRole(userRole: UserRole) {
    const accounts = this.authService.instance.getAllAccounts();

    // If current service is missing an account,
    // or the claims, the service default to no access.
    if (accounts.length != 1) {
      return false;
    }

    const claims = accounts[0].idTokenClaims

    if (!claims || !claims[roleClaimName]) {
      return false;
    }

    // Because the claim is currently an extension, the format of ["roleName1"],
    // but is currently received as a string.
    const claimAsJson = "{ \"value\": " + claims[roleClaimName] + "}"

    const assignedRoles = JSON.parse(claimAsJson).value as UserRole[];
    return assignedRoles.includes(userRole);
  }
}
