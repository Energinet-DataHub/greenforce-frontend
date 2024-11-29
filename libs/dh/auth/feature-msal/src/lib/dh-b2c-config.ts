import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';

import { DhApiEnvironment, DhB2CEnvironment } from '@energinet-datahub/dh/shared/environments';

export function MSALInstanceFactory(config: DhB2CEnvironment): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
      navigateToLoginRequestUrl: false,
      knownAuthorities: config.knownAuthorities,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback: (logLevel: LogLevel, message: string) => {
          reloadOnLoginFailed(message);
        },
        logLevel: LogLevel.Error,
        piiLoggingEnabled: false,
      },
      allowNativeBroker: false,
      // This value should be higher than the interval of the timer in DhSseLink,
      // which is currently set to 30 seconds. If the value is less than that
      // interval, GraphQL subscriptions may briefly be using an expired token.
      tokenRenewalOffsetSeconds: 60,
    },
  });
}

function reloadOnLoginFailed(error: string) {
  const loginFailed = error.includes('Error - Guard - error while logging in, unable to activate');

  if (loginFailed) {
    window.location.reload();
  }
}

export function MSALInterceptorConfigFactory(
  config: DhB2CEnvironment,
  api: DhApiEnvironment
): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string> | null>();
  protectedResourceMap.set(`${api.apiBase}/*`, [config.scopeUri]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
    authRequest: (msalService, req, originalAuthRequest) => {
      if (!originalAuthRequest.account?.idTokenClaims) return originalAuthRequest;

      const tfp = originalAuthRequest.account?.idTokenClaims['tfp'] as unknown as string;

      const midId = config.mitIdFlowUri.endsWith(tfp);

      return {
        ...originalAuthRequest,
        authority: midId ? config.mitIdFlowUri : config.authority,
      };
    },
  };
}

export function MSALGuardConfigFactory(config: DhB2CEnvironment): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: { scopes: [config.scopeUri] },
  };
}
