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

import { Injectable, NgModule } from '@angular/core';
import {
  DhApiEnvironment,
  DhB2CEnvironment,
  dhApiEnvironmentToken,
  dhB2CEnvironmentToken,
} from '@energinet-datahub/dh/shared/environments';
import {
  AbstractLoggerService,
  AbstractSecurityStorage,
  AuthModule,
  DefaultLocalStorageService,
  LogLevel,
  OpenIdConfiguration,
  StsConfigLoader,
  StsConfigStaticLoader,
} from 'angular-auth-oidc-client';

export const LoginAzureProviderConfigId = 'OidcAzureB2C';
export const LoginMitIdProviderConfigId = 'OidcMitId';

const authConfigFactory = (b2cEnvironment: DhB2CEnvironment, apiEnvironment: DhApiEnvironment) => {
  const baseConfig: OpenIdConfiguration = {
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: b2cEnvironment.clientId,
    scope: 'openid profile offline_access ' + b2cEnvironment.scopeUri,
    secureRoutes: [apiEnvironment.apiBase],
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    ignoreNonceAfterRefresh: true,
    autoUserInfo: false,
    logLevel: LogLevel.Debug,
  };

  return new StsConfigStaticLoader([
    {
      configId: LoginAzureProviderConfigId,
      authority: b2cEnvironment.authorityB2C + 'v2.0/',
      ...baseConfig,
    },
    {
      configId: LoginMitIdProviderConfigId,
      authority: b2cEnvironment.authorityMitID + 'v2.0/',
      ...baseConfig,
    },
  ]);
};

@Injectable()
export class MyLoggerService implements AbstractLoggerService {
  logError(message: any, ...args: any[]): void {
    console.log(message, args);
  }
  logWarning(message: any, ...args: any[]): void {
    console.log(message, args);
  }
  logDebug(message: any, ...args: any[]): void {
    console.log(message, args);
  }
}

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: authConfigFactory,
        deps: [dhB2CEnvironmentToken, dhApiEnvironmentToken],
      },
    }),
  ],
  exports: [AuthModule],
  providers: [
    {
      // Changes session storage to localstorage.
      provide: AbstractSecurityStorage,
      useClass: DefaultLocalStorageService,
    },
    { provide: AbstractLoggerService, useClass: MyLoggerService }
  ],
})
export class AuthConfigModule {}
