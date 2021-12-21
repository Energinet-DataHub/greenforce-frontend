import {
  AuthenticationResult,
  IPublicClientApplication,
  Logger,
} from '@azure/msal-browser';
import { MockProvider } from 'ng-mocks';
import { Observable, of } from 'rxjs';

import { MsalService } from '@energinet-datahub/dh/auth/msal';

const accountMock = {
  environment: '',
  homeAccountId: '',
  idTokenClaims: {},
  localAccountId: '',
  name: '',
  tenantId: '',
  username: '',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleRedirectObservableMock(
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
    idTokenClaims: {},
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
    errorPii: (message: string, _correlationId?: string) => {
      console.log('errorPii:', message);
    },
  } as unknown as Logger;
}

export const MsalServiceFake = MockProvider(MsalService, {
  handleRedirectObservable: handleRedirectObservableMock,
  getLogger: getLoggerMock,
  instance: {
    getAllAccounts: () => [accountMock],
  } as IPublicClientApplication,
});
