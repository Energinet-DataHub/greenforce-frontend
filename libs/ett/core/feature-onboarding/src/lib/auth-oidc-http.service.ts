import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@energinet-datahub/ett/core/environments';
import { Observable } from 'rxjs';

export interface AuthOidcLoginResponse {
  readonly url: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthOidcHttp {
  constructor(private http: HttpClient) {}

  login(redirectUri: string): Observable<AuthOidcLoginResponse> {
    return this.http.get<AuthOidcLoginResponse>(
      `${environment.apiBase}/oidc/login`,
      {
        params: {
          redirect_uri: redirectUri,
        },
      }
    );
  }
}
