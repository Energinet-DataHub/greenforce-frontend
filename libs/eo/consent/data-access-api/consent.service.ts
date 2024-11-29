import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { map } from 'rxjs';

export interface EoConsentClient {
  name: string;
  redirectUrl: string;
}

export interface EoConsent {
  consentDate: number;
  consentId: string;
  giverOrganizationId: string;
  giverOrganizationName: string;
  giverOrganizationTin: string;
  receiverOrganizationId: string;
  receiverOrganizationName: string;
  receiverOrganizationTin: string;
}

export interface EoReceivedConsent {
  consentDate: number;
  consentId: string;
  organizationId: string;
  organizationName: string;
  tin: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoConsentService {
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #apiBase = this.#apiEnvironment.apiBase;

  getClient(thirdPartyClientId: string) {
    return this.#http.get<EoConsentClient>(
      `${this.#apiBase}/authorization/client/${thirdPartyClientId}`
    );
  }

  getOrganization(organizationId: string) {
    return this.#http.get<EoReceivedConsent>(
      `${this.#apiBase}/authorization/organization/${organizationId}`
    );
  }

  getConsents() {
    return this.#http
      .get<{ result: EoConsent[] }>(`${this.#apiBase}/authorization/consents`)
      .pipe(map((res) => res.result));
  }

  getReceivedConsents() {
    return this.#http
      .get<{
        result: EoReceivedConsent[];
      }>(`${this.#apiBase}/authorization/consents/organization/received`)
      .pipe(map((res) => res.result));
  }

  grantClient(thirdPartyClientId: string) {
    return this.#http.post(`${this.#apiBase}/authorization/consent/client/grant`, {
      idpClientId: thirdPartyClientId,
    });
  }

  grantOrganization(organizationId: string) {
    return this.#http.post(`${this.#apiBase}/authorization/consent/organization/grant`, {
      organizationId,
    });
  }

  delete(consentId: string) {
    return this.#http.delete(`${this.#apiBase}/authorization/consents/${consentId}`);
  }
}
