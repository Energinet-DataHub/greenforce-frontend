import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

@Injectable({
  providedIn: 'root',
})
export class EoTermsService {
  private currentVersion = -1;
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #apiBase = this.#apiEnvironment.apiBase;

  setVersion(version: number) {
    this.currentVersion = version;
  }

  acceptTerms() {
    return this.#http.put(`${this.#apiBase}/terms/user/accept/${this.currentVersion}`, null);
  }
}
