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
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #mockToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NzgzOTQzMzQsImV4cCI6MTcwOTkzMDMzNCwibmFtZSI6IkRlbW8gTG9uZSIsInNjb3BlIjoiWyd0ZXN0MScsJ3Rlc3QyJ10iLCJmaXJzdE5hbWUiOiJEZW1vIiwibGFzdE5hbWUiOiJMb25lIiwiZW1haWwiOiJkZW1vQGxvbmUuZGsifQ.hjxNCA-atOO5pebWNO2_PwQ6bR96e7AN3mWvo54mEAQ';
  #apiBase: string;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}/auth`;
  }

  storeToken(token: string) {
    console.log('token', this.getDecodedAccessToken(token));
  }

  login() {
    //return this.http.get(`${this.#apiBase}/login`);
    return of(this.#mockToken).subscribe((token) => {
      this.storeToken(token);
    });
  }

  logout(): Observable<AuthLogoutResponse> {
    return this.http.post<AuthLogoutResponse>(
      `${this.#apiBase}/logout`,
      {
        // empty body
      },
      { withCredentials: true }
    );
  }

  getDecodedAccessToken(token: string) {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
