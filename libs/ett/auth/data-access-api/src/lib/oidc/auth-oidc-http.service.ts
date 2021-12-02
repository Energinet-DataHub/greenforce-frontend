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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@energinet-datahub/ett/core/environments';
import { EMPTY, mergeMap, Observable, of, throwError } from 'rxjs';

import { AuthOidcQueryParameterName } from './auth-oidc-query-parameter-name';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

export interface AuthOidcLoginResponse {
  readonly url: string;
}

export interface AuthProfile {
  readonly company?: string | null;
  readonly id: string;
  readonly name: string;
}

export interface AuthProfileResponse {
  readonly success: boolean;
  readonly profile?: AuthProfile | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthOidcHttp {
  #apiBase = `${environment.apiBase}/auth`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<AuthProfile> {
    return this.http.get<AuthProfileResponse>(`${this.#apiBase}/profile`).pipe(
      mergeMap((response) =>
        response.success
          ? of(response.profile)
          : throwError(() => new Error('User authenticated failed'))
      ),
      mergeMap((profile) =>
        profile == null
          ? throwError(() => new Error('User profile not in response'))
          : of(profile)
      )
    );
  }

  login(returnUrl: string): Observable<AuthOidcLoginResponse> {
    return this.http.get<AuthOidcLoginResponse>(`${this.#apiBase}/oidc/login`, {
      params: {
        [AuthOidcQueryParameterName.ReturnUrl]: returnUrl,
      },
    });
  }

  logout(): Observable<AuthLogoutResponse> {
    return this.http
      .get<AuthLogoutResponse>(`${this.#apiBase}/logout`)
      .pipe(
        mergeMap((response) =>
          response.success
            ? EMPTY
            : throwError(() => new Error('User logout failed'))
        )
      );
  }
}
