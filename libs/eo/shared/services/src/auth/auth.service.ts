import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

export interface AuthLogoutResponse {
  readonly success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #apiBase: string;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}/auth`;
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
}
