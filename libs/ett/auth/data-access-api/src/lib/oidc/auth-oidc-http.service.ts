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
export interface AuthOidcLoginResponse {
  readonly url: string;
}

export interface AuthOidcLogoutResponse {
  readonly success: boolean;
}

export interface AuthProfile {
  readonly id: string;
  readonly name: string;
  readonly company?: string | null;
}

export interface GetProfileResponse {
  readonly success: boolean;
  readonly profile?: AuthProfile | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthOidcHttp {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<AuthProfile> {
    return this.http
      .get<GetProfileResponse>(`${environment.apiBase}/auth/profile`)
      .pipe(
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
    return this.http.get<AuthOidcLoginResponse>(
      `${environment.apiBase}/auth/oidc/login`,
      {
        params: {
          [AuthOidcQueryParameterName.ReturnUrl]: returnUrl,
        },
      }
    );
  }

  logout(): Observable<AuthOidcLogoutResponse> {
    return this.http
      .get<AuthOidcLogoutResponse>(`${environment.apiBase}/auth/logout`)
      .pipe(
        mergeMap((response) =>
          response.success
            ? EMPTY
            : throwError(() => new Error('User logout failed'))
        )
      );
  }
}
