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
import { Observable } from 'rxjs';

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

export interface UserProfile {
  readonly id: string;
  readonly name: string;
  readonly company?: string;
}

export interface GetProfileResponse {
  readonly success: boolean;
  readonly profile: UserProfile;
}

@Injectable({
  providedIn: 'root',
})
export class AuthOidcHttp {
  constructor(private http: HttpClient) {}

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
    return this.http.get<AuthOidcLogoutResponse>(
      `${environment.apiBase}/auth/logout`,
      {}
    );
  }

  getProfile(): Observable<GetProfileResponse> {
    return this.http.get<GetProfileResponse>(
      `${environment.apiBase}/auth/profile`,
      {}
    );
  }
}
