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

import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';

import { DhB2CEnvironment } from '@energinet-datahub/dh/shared/environments';

export function MSALInstanceFactory(
  config: DhB2CEnvironment
): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
      knownAuthorities: config.knownAuthorities,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
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
    },
  });
}

function reloadOnLoginFailed(error: string) {
  const loginFailed = error.includes(
    'Error - Guard - error while logging in, unable to activate'
  );
  if (loginFailed) {
    window.location.reload();
  }
}

export function MSALInterceptorConfigFactory(
  config: DhB2CEnvironment
): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('*', [config.backendId || config.clientId]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(
  config: DhB2CEnvironment
): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: { scopes: [config.backendId || config.clientId] },
  };
}
