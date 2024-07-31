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
import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { User, UserManager } from 'oidc-client-ts';

import { eoB2cEnvironmentToken, EoB2cEnvironment } from '@energinet-datahub/eo/shared/environments';

export interface EoUser {
  id_token: string;
  name: string;
  org_name: string;
  org_cvr: string;
  org_ids: string;
  scope?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  private transloco = inject(TranslocoService);
  private b2cEnvironment: EoB2cEnvironment = inject(eoB2cEnvironmentToken);
  private userManager: UserManager | null = null;

  user = signal<EoUser | null>(null);

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
      redirect_uri: `${window.location.origin}/${this.transloco.getActiveLang()}/callback`,
      /*
       * The silent_redirect_uri is used to redirect the user back to the application after the token is renewed.
       */
      silent_redirect_uri: `${window.location.origin}/silent-callback.html`,
      /*
       * The post_logout_redirect_uri is the URL of the application where the user is redirected after the sign-out process.
       */
      post_logout_redirect_uri: `${window.location.origin}/${this.transloco.getActiveLang()}`,
      /*
       * The response_type is the type of the response. Possible values are 'code' and 'token'.
       */
      response_type: 'code',
    };

    this.userManager = new UserManager(settings);
  }

  login(redirectUrl?: string, thirdPartyClientId?: string): Promise<void> {
    return (
      this.userManager?.signinRedirect({ state: { thirdPartyClientId, redirectUrl } }) ??
      Promise.resolve()
    );
  }

  private setUser(user: User | null): void {
    user
      ? this.user.set({
          id_token: user?.id_token ?? '',
          name: user?.profile?.name ?? '',
          org_cvr: (user?.profile?.org_cvr as string) ?? '',
          org_ids: (user?.profile?.org_ids as string) ?? '',
          org_name: (user?.profile?.org_name as string) ?? '',
          scope: user?.scopes,
        })
      : this.user.set(null);
  }

  signinCallback(): Promise<User | null> {
    return this.userManager
      ? this.userManager?.signinCallback().then((user) => {
          if (user) {
            this.setUser(user);
          }
          return Promise.resolve(user ?? null);
        })
      : Promise.resolve(null);
  }

  renewToken(): Promise<User | null> {
    return this.userManager?.signinSilent() ?? Promise.resolve(null);
  }

  logout(): Promise<void> {
    return this.userManager?.signoutRedirect() ?? Promise.resolve();
  }

  refreshToken(): Promise<User | null> {
    return this.userManager ? this.userManager?.signinSilent() : Promise.resolve(null);
  }

  checkForExistingToken() {
    return this.userManager?.getUser().then((user) => {
      if (!user) return;
      this.setUser(user);
    });
  }
}
