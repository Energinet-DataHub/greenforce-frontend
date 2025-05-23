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
import { AuthenticationResult, IPublicClientApplication, Logger } from '@azure/msal-browser';
import { MockProvider } from 'ng-mocks';
import { Observable, from, of } from 'rxjs';
import { MsalGuard, MsalService } from '@azure/msal-angular';

const accountMock = {
  environment: '',
  homeAccountId: '',
  localAccountId: '',
  name: '',
  tenantId: '',
  username: '',
};

function handleRedirectObservableMock(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _hash?: string
): Observable<AuthenticationResult> {
  return of({
    accessToken: '',
    account: accountMock,
    authority: '',
    correlationId: '',
    expiresOn: null,
    fromCache: true,
    idToken: '',
    idTokenClaims: {
      given_name: '',
    },
    scopes: [],
    state: '',
    tenantId: '',
    tokenType: '',
    uniqueId: '',
  });
}

function getLoggerMock(): Logger {
  return {
    verbose: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: (message: string, _correlationId?: string) => {
      console.log('error:', message);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info: (message: string, _correlationId?: string) => {
      console.log('info:', message);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infoPii: (message: string, _correlationId?: string) => {
      console.log('infoPii:', message);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorPii: (message: string, _correlationId?: string) => {
      console.log('errorPii:', message);
    },
  } as unknown as Logger;
}

export const MsalServiceMock = MockProvider(MsalService, {
  handleRedirectObservable: handleRedirectObservableMock,
  getLogger: getLoggerMock,
  instance: {
    getAllAccounts: () => [accountMock],
    getActiveAccount: () => accountMock,
  } as IPublicClientApplication,
  initialize: () => from(Promise.resolve()),
});

export const MsalGuardMock = MockProvider(MsalGuard, {
  canActivate: () => of(true),
});
