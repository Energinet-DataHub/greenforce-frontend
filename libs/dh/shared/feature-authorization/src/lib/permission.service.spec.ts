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
import { firstValueFrom, of } from 'rxjs';
import { DeepPartial } from 'chart.js/types/utils';
import { DhB2CEnvironment } from '@energinet-datahub/dh/shared/environments';
import { ActorTokenService } from './actor-token.service';

describe(PermissionService.name, () => {
  // base64 encoded access token: { role: ['organization:view'] }
  const fakeAccessToken =
    'ignored.eyAicm9sZSI6IFsgIm9yZ2FuaXphdGlvbjp2aWV3IiBdIH0K';

  test('should return false if no account is found', async () => {
    // arrange
    const instance: Partial<IPublicClientApplication> = {
      getAllAccounts: () => [],
    };

    const target = new PermissionService(
      {} as DhB2CEnvironment,
      {} as ActorTokenService,
      {
        instance: instance,
      } as MsalService
    );

    // act
    const actual = await firstValueFrom(
      target.hasPermission('gridareas:manage')
    );

    // assert
    expect(actual).toBe(false);
  });

  test('should return true if permission is found within access token roles', async () => {
    // arrange
    const instance: Partial<IPublicClientApplication> = {
      getAllAccounts: () => [{} as AccountInfo],
    };

    const authService: DeepPartial<MsalService> = {
      instance: instance,
      acquireTokenSilent: () =>
        of({ accessToken: fakeAccessToken } as AuthenticationResult),
    };

    const target = new PermissionService(
      {} as DhB2CEnvironment,
      {
        acquireToken: (e) => of(e),
      } as ActorTokenService,
      authService as MsalService
    );

    // act
    const actual = await firstValueFrom(
      target.hasPermission('organization:view')
    );

    // assert
    expect(actual).toBe(true);
  });

  test('should return false if permission is not found within access token roles', async () => {
    // arrange
    const instance: Partial<IPublicClientApplication> = {
      getAllAccounts: () => [{} as AccountInfo],
    };

    const authService: DeepPartial<MsalService> = {
      instance: instance,
      acquireTokenSilent: () =>
        of({ accessToken: fakeAccessToken } as AuthenticationResult),
    };

    const target = new PermissionService(
      {} as DhB2CEnvironment,
      {
        acquireToken: (e) => of(e),
      } as ActorTokenService,
      authService as MsalService
    );

    // act
    const actual = await firstValueFrom(
      target.hasPermission('gridareas:manage')
    );

    // assert
    expect(actual).toBe(false);
  });
});
