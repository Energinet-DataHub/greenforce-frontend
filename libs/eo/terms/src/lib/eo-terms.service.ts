import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

export interface AuthTermsAcceptRequest {
  accepted: boolean;
  state: string;
  /**
   * A string: I.eg: "0.1"
   */
  version: string;
}

export interface AuthTermsAcceptResponse {
  /**
   * A url
   */
  readonly next_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoTermsService {
  #apiBase: string;
  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}/auth`;
  }

  postAcceptTerms(
    payload: AuthTermsAcceptRequest
  ): Observable<AuthTermsAcceptResponse> {
    return this.http.post<AuthTermsAcceptResponse>(
      `${this.#apiBase}/terms/accept`,
      payload,
      { withCredentials: true }
    );
  }
}
