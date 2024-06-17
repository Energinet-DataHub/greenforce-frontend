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
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { User, UserManager } from 'oidc-client-ts';

import { eoB2cEnvironmentToken, EoB2cEnvironment } from '@energinet-datahub/eo/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private transloco = inject(TranslocoService);
  private b2cEnvironment: EoB2cEnvironment = inject(eoB2cEnvironmentToken);

  userManager: UserManager | null = null;

  constructor() {
    const settings = {
      /*
       * The authority is the URL of the OIDC provider.
       */
      authority: this.b2cEnvironment.issuer,
      /*
       * The client_id is the application ID of the application registered in the OIDC provider.
       */
      client_id: this.b2cEnvironment.client_id,
      /*
       * The redirect_uri is the URL of the application where the user is redirected after the sign-in process.
       */
      redirect_uri: `http://localhost:4200/${this.transloco.getActiveLang()}/callback`,
      /*
       * The silent_redirect_uri is used to redirect the user back to the application after the token is renewed.
       */
      silent_redirect_uri: `http://localhost:4200/silent-callback.html`,
      /*
       * The post_logout_redirect_uri is the URL of the application where the user is redirected after the sign-out process.
       */
      post_logout_redirect_uri: `http://localhost:4200/${this.transloco.getActiveLang()}`,
      /*
       * The response_type is the type of the response. Possible values are 'code' and 'token'.
       */
      response_type: 'code',
    };

    this.userManager = new UserManager(settings);
  }

  getUser(): Promise<User | null> {
    return this.userManager?.getUser() ?? Promise.resolve(null);
  }

  login(thirdPartyClientId: string | null): Promise<void> {
    return this.userManager?.signinRedirect({ state: { thirdPartyClientId } }) ?? Promise.resolve();
  }

  renewToken(): Promise<User | null> {
    return this.userManager?.signinSilent() ?? Promise.resolve(null);
  }

  logout(): Promise<void> {
    return this.userManager?.signoutRedirect() ?? Promise.resolve();
  }
}
