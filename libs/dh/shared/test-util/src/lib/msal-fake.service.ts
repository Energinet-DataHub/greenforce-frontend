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
