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
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

import { AuthOidcQueryParameterName } from './auth-oidc-query-parameter-name';

export interface AuthOidcLoginResponse {
  /**
   * The URL to redirect the user to in order to authenticate.
   */
  readonly next_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHttp {
  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) private apiEnvironment: EoApiEnvironment
  ) {}

  /**
   *
   * @param feUrl Base URL for authentication web app.
   * @param returnUrl Absolute URL to return to after authentication.
   */
  getLogin(
    feUrl: string,
    returnUrl: string
  ): Observable<AuthOidcLoginResponse> {
    return this.http.get<AuthOidcLoginResponse>(
      `${this.apiEnvironment.apiBase}/auth/oidc/login`,
      {
        params: {
          [AuthOidcQueryParameterName.FeUrl]: feUrl,
          [AuthOidcQueryParameterName.ReturnUrl]: returnUrl,
        },
      }
    );
  }

  getTerms(): Observable<string> {
    return this.http.get<string>(`${this.apiEnvironment.apiBase}/terms`);
  }

  // @todo: Remove <any> -> Return type for this request?
  // @todo: Expected payload for this request?
  acceptTerms(): Observable<any> {
    return this.http.post(`${this.apiEnvironment.apiBase}/terms/accept`, {});
  }
}
