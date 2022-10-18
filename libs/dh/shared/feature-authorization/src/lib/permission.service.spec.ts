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

import { PermissionService } from './permission.service';
import { MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { ScopeService } from './scope.service';
import { firstValueFrom, of } from 'rxjs';
import { DeepPartial } from 'chart.js/types/utils';

describe(PermissionService.name, () => {
  // base64 encoded access token: { roles: ['organization'] }
  const accessTokenContainingOrganizationPermission = 'ignored.eyJyb2xlcyI6WyJvcmdhbml6YXRpb24iXX0=';

  test('should return false if now account is found', async () => {
    // arrange
    const instance: Partial<IPublicClientApplication> = {
      getAllAccounts: () => [],
    };

    const target = new PermissionService(
      {} as ScopeService,
      {
        instance: instance,
      } as MsalService
    );

    // act
    const actual = await firstValueFrom(target.hasPermission('gridarea'));

    // assert
    expect(actual).toBeFalsy();
  });

  test('should return true if permission is found within access token roles', async () => {
    // arrange
    const instance: Partial<IPublicClientApplication> = {
      getAllAccounts: () => [{} as AccountInfo],
    };

    const authService: DeepPartial<MsalService> = {
      instance: instance,
      acquireTokenSilent: () => of({ accessToken: accessTokenContainingOrganizationPermission } as AuthenticationResult),
    };

    const target = new PermissionService(
      { getActiveScope: () => 'fake_value' } as ScopeService,
      authService as MsalService
    );

    // act
    const actual = await firstValueFrom(target.hasPermission('organization'));

    // assert
    expect(actual).toBeTruthy();
  });

  test('should return false if permission is not found within access token roles', async () => {
    // arrange
    const instance: Partial<IPublicClientApplication> = {
      getAllAccounts: () => [{} as AccountInfo],
    };

    const authService: DeepPartial<MsalService> = {
      instance: instance,
      acquireTokenSilent: () => of({ accessToken: accessTokenContainingOrganizationPermission } as AuthenticationResult),
    };

    const target = new PermissionService(
      { getActiveScope: () => 'fake_value' } as ScopeService,
      authService as MsalService
    );

    // act
    const actual = await firstValueFrom(target.hasPermission('gridarea'));

    // assert
    expect(actual).toBeFalsy();
  });
});
