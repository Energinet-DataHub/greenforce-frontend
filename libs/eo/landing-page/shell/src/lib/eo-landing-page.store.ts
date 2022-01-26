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
import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, of } from 'rxjs';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { AbsoluteUrlGenerator } from '@energinet-datahub/ett/shared/util-browser';
import { AuthOidcQueryParameterName } from '@energinet-datahub/ett/auth/data-access-api';
import { ettDashboardRoutePath } from '@energinet-datahub/ett/dashboard/routing';

@Injectable()
export class LandingPageStore extends ComponentStore<LandingPageStateInterface> {
  /**
   * @description This is the return url/destination we want the users to redirect to, after a successful login.
   */
  private readonly absoluteReturnUrl = this.urlGenerator.fromCommands([
    ettDashboardRoutePath,
  ]);

  /**
   * @description
   *  - NGRX ComponentStore 'select'.
   *  - This is the public available Observable any interested parties can subscribe to, and get the OIDC authentication url.
   *
   * @todo How to not omit the initial null value from the initial state?
   */
  public readonly authenticationUrl$: Observable<string> = this.select<string>(
    (state) => state.next_url
  );

  constructor(
    private readonly authOidcHttpClient: AuthHttp,
    private readonly urlGenerator: AbsoluteUrlGenerator,
    @Inject(APP_BASE_HREF) private readonly appBaseHref: string
  ) {
    super(initialState);

    // We dispatch the initial http request for the authentication url in the constructor.
    // This way the url will be available straight away via a subscription to the 'authenticationUrl$' Observable.
    // Example: this.landingPageStore.authenticationUrl$.subscribe(url => ...).
    this.loadAuthenticationUrl({
      [AuthOidcQueryParameterName.FeUrl]: this.appBaseHref,
      [AuthOidcQueryParameterName.ReturnUrl]: this.absoluteReturnUrl,
    });
  }

  /**
   * @description
   *  - NGRX ComponentStore 'effect'.
   *  - Sends a http request to get the authentication url.
   *  - The method is private as we do not have any need to dynamically authenticate against multiple external endpoints.
   */
  private loadAuthenticationUrl = this.effect<queryParams>((queryParams$) => {
    return queryParams$.pipe(
      switchMap((queryParams) =>
        this.authOidcHttpClient
          .getLogin(queryParams.fe_url, queryParams.return_url)
          .pipe(
            tapResponse(
              (response) => this.updateAuthenticationUrl(response.next_url),
              (error: HttpErrorResponse) => of(error)
            )
          )
      )
    );
  });

  /**
   * @description
   *  - NGRX ComponentStore 'updater'.
   *  - Updates the state of the store, with a new authentication url.
   */
  private updateAuthenticationUrl = this.updater(
    (
      state: LandingPageStateInterface,
      next_url: string
    ): LandingPageStateInterface => ({
      ...state,
      next_url,
    })
  );
}

export interface LandingPageStateInterface {
  next_url: string;
}

const initialState: LandingPageStateInterface = {
  next_url: '',
};

interface queryParams {
  readonly [AuthOidcQueryParameterName.FeUrl]: string;
  readonly [AuthOidcQueryParameterName.ReturnUrl]: string;
}
