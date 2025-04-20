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
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { User, UserManager } from 'oidc-client-ts';
import { BehaviorSubject, lastValueFrom, Subject } from 'rxjs';

import { WindowService } from '@energinet-datahub/gf/util-browser';

import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
  EoB2cEnvironment,
  eoB2cEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';

export interface EoUser extends User {
  profile: {
    sub: string;
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    name: string;
    org_name: string;
    org_id: string;
    org_cvr: string;
    org_ids: string;
    tos_accepted: boolean;
  };
  state: {
    thirdPartyClientId?: string;
    redirectUrl?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private http: HttpClient = inject(HttpClient);
  private window = inject(WindowService).nativeWindow;
  private b2cEnvironment: EoB2cEnvironment = inject(eoB2cEnvironmentToken);
  private apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);

  // Events
  private addUserLoaded = new BehaviorSubject<User | null>(null);
  private addUserUnloaded = new Subject<void>();

  addUserUnloaded$ = this.addUserUnloaded.asObservable();
  addUserLoaded$ = this.addUserLoaded.asObservable();
  userManager: UserManager | null = null;
  user = signal<EoUser | null>(null);

  constructor() {
    if (!this.window) return;

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

      scopes: `openid offline_access ${this.b2cEnvironment.client_id}`,
    };

    this.userManager = new UserManager(settings);

    this.userManager.events.addUserLoaded((user) => {
      this.addUserLoaded.next(user);
    });

    this.userManager.events.addUserUnloaded(() => {
      this.addUserUnloaded.next();
    });

    this.userManager.events.addSilentRenewError(error => {
      console.error('Silent renew failed:', error);
      // check for HTTP‑400 from your token endpoint
      const status = (error as any).xhr?.status ?? (error as any).status;
      if (status === 400) {
        this.handleBadRefresh();
      }
    });
  }

  login(config?: {
    thirdPartyClientId?: string | null;
    redirectUrl?: string | null;
  }): Promise<void> {
    return (
      this.userManager?.signinRedirect({
        state: config,
        scope: `openid offline_access ${this.b2cEnvironment.client_id}`,
      }) ?? Promise.resolve()
    );
  }

  async acceptTos(): Promise<void> {
    const user = (await this.userManager?.getUser()) as User;

    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirectUrl');
    const thirdPartyClientId = urlParams.get('third-party-client-id');

    // If user is not logged in, redirect to login
    if (!user) {
      this.login();
    }

    // If user has already accepted TOS, return
    if (user?.profile['tos_accepted']) {
      return new Promise((resolve) => resolve());
    }

    // Accept TOS
    await lastValueFrom(
      this.http.post(`${this.apiEnvironment.apiBase}/authorization/terms/accept`, {})
    );

    // Force user to log out to get new token with TOS accepted
    return this.login({ redirectUrl, thirdPartyClientId });
  }

  signinCallback(): Promise<User | null> {
    return this.userManager
      ? this.userManager?.signinCallback().then((user) => {
          if (user) {
            this.user.set((user as EoUser) ?? null);
          }
          return Promise.resolve(user ?? null);
        })
      : Promise.resolve(null);
  }

  async renewToken(): Promise<User | null> {
    try {
      return await this.userManager!.signinSilent();
    } catch (err: any) {
      const status = err.xhr?.status ?? err.status;
      if (status === 400) {
        this.handleBadRefresh();
      }
      return null;
    }
  }

  private handleBadRefresh() {
    // 1) clear out all your auth state
    localStorage.clear();
    sessionStorage.clear();
    document.cookie
      .split(';')
      .forEach(c => {
        const name = c.split('=')[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    this.userManager?.removeUser();
    this.user.set(null);

    // 2) send them to “contact support”
    this.router.navigate([
      this.transloco.getActiveLang(),
      eoRoutes.contactSupport
    ]);
  }

  async logout(): Promise<void> {
    await this.userManager?.signoutRedirect();

    // Make sure to clear all data
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    await this.userManager?.removeUser();

    return Promise.resolve();
  }

  isLoggedIn(): Promise<boolean> {
    return (
      this.userManager?.getUser().then(
        (user) => {
          if (user && !user.expired) {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        },
        () => Promise.resolve(false)
      ) ?? Promise.resolve(false)
    );
  }

  checkForExistingToken() {
    return this.userManager?.getUser().then((user) => {
      if (!user) return;
      this.user.set((user as EoUser) ?? null);
    });
  }
}
