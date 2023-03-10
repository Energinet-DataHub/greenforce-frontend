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
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthService {
  #loginUrl: string;
  #authApiBase: string;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#authApiBase = `${apiEnvironment.apiBase}/auth`;
    this.#loginUrl = `${apiEnvironment.apiBase}/auth/oidc/login?fe_url=${window.location.origin}&return_url=${window.location.origin}/dashboard`;
  }

  startLogin() {
    this.http.get(`${this.#loginUrl}`).subscribe((response: any) => {
      window.location.href = response.next_url;
    });
  }

  logout(): Observable<AuthLogoutResponse> {
    return this.http.post<AuthLogoutResponse>(
      `${this.#authApiBase}/logout`,
      {},
      { withCredentials: true }
    );
  }
}
