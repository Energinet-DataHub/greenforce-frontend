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
import { ActivatedRoute, Router } from '@angular/router';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { EoAuthStore, EoLoginToken } from './auth.store';

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
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private store: EoAuthStore,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#authApiBase = `${apiEnvironment.apiBase}/auth`;
    this.#loginUrl = `${apiEnvironment.apiBase}/auth/oidc/login?fe_url=${window.location.origin}&return_url=${window.location.origin}/dashboard`;
  }

  handlePostLogin() {
    const mockToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjcwMTRjNTQtZTBmYS00MjdkLWJhYjYtYzNhY2ZkZDZjNWQ3Iiwic3ViIjoiYjY3OTU4MjItNDliMi00ZDlmLWI5NjYtZWUxNTRiZjQ2YzMwIiwic2NvcGUiOiJhY2NlcHRlZC10ZXJtcyBkYXNoYm9hcmQgcHJvZHVjdGlvbiBtZXRlcnMgY2VydGlmaWNhdGVzIiwiZWF0IjoibStvQzhRMVBjV0JaZmViaVVmYTNjNWlYZU1OUmM3Z3J3UGVDaGIwQXlqQXBSOUlIQi93VER0ZVhGajRqZDVOd3U1THBtSHpZRUlWSU04d24ycUMxR3c9PSIsImVpdCI6IkxBSWs5ejM4TGt3d2dKWndCb1RndVY3MmJpbEJucDkrNDBheGF2Yy9EY3FqeDgzaG1wZXhHaDVRdXh5SWtsNFpBUU9yMVFWWWhudXJVUzFPTEppT1hBPT0iLCJleHQiOiI5NTk3NmJhMC0yYzU0LTRmMTYtOTVlYS0wNDU3NWZmMDg4YTYiLCJ0cm0iOjEsImFjbCI6dHJ1ZSwibmJmIjoxNjc4NDM2NzcxLCJleHAiOjE2ODA1MTAzNzEsImlhdCI6MTY3ODQzNjc3MSwiaXNzIjoiVXMiLCJhdWQiOiJVc2VycyJ9.ut5DNtyXPwZpbJqNCOmVDmBBvPbFypVW4vFVLuJuRFlHmHvrNhWLefe-awlf1LG0P2FvXnegyi9fXZBVZjgKMbx-d6TDmAF5tYv5bQC5q7z6F67hfQQPJv-TvxgBKZyp7mjOw-BI68QS6hKr6YX7gf0L0Rd8IzVItgYv7dcEMzYAQdapxdA-Hu2k98veE3g6VGAMdZGcf8hZEqzIUjBt-JSz2u54aZfe6Gt-VoKQs18LVlYxGn3gvglUxiYDGm42awKHEJQ69YEkwF6-QeRQs35gAXF8t_ApzSLFXj5KRGT34dSFCqxnBu34n6UFRNn7aWt244jSt8Rlm-Phx2PWKQ';

    let token: EoLoginToken;
    try {
      token = jwt_decode(this.route.snapshot?.queryParams['state']);
    } catch {
      token = jwt_decode(mockToken);
    }

    this.router.navigate([], {
      queryParams: { state: null, success: null },
      queryParamsHandling: 'merge',
    });
    this.store.setLoginToken(token);
  }

  startLogin() {
    this.http
      .get<{ next_url: string }>(`${this.#loginUrl}`)
      .subscribe((response) => (window.location.href = response.next_url));
  }

  logout(): Observable<AuthLogoutResponse> {
    return this.http.post<AuthLogoutResponse>(
      `${this.#authApiBase}/logout`,
      {},
      { withCredentials: true }
    );
  }
}
