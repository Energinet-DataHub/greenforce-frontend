/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalInterceptorConfiguration } from '@azure/msal-angular';
import { BrowserCacheLocation, BrowserUtils, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalGuard, MsalGuardConfiguration, MsalModule } from '@energinet-datahub/dh/auth/msal';
import { DhTranslocoModule } from '@energinet-datahub/dh/globalization/configuration-localization';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/shell';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { apiConfig, b2cPolicies } from './b2c-config';

import {
  DhCoreShellComponent,
  DhCoreShellScam,
} from './dh-core-shell.component';

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '88e5d356-0c71-49e9-b260-d0629f3c0445',
      authority: b2cPolicies.authorities.signIn.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(apiConfig.uri, apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...apiConfig.scopes],
    },
    loginFailedRoute: 'login-failed',
  };
}

const routes: Routes = [
  {
    path: '',
    component: DhCoreShellComponent,
    children: [
      {
        path: '',
        redirectTo: dhMeteringPointPath,
        pathMatch: 'full',
      },
      {
        path: dhMeteringPointPath,
        loadChildren: () =>
          import('@energinet-datahub/dh/metering-point/shell').then(
            (esModule) => esModule.DhMeteringPointShellModule
          ),
          canActivate: [
            MsalGuard,
          ]
      },
    ],
  },
  // Used by MSAL (B2C)
  { path: 'state', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    DhCoreShellScam,
    HttpClientModule,
    DhApiModule.forRoot(),
    DhTranslocoModule.forRoot(),
    MsalModule.forRoot(
      MSALInstanceFactory(),
      MSALGuardConfigFactory(),
      MSALInterceptorConfigFactory()
    ),
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      useHash: true,
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? 'enabled'
          : 'disabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
})
export class DhCoreShellModule {}
