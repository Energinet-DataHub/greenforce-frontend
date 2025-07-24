//#region License
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
//#endregion
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import {
  EttApiEnvironment,
  ettApiEnvironmentToken,
} from '@energinet-datahub/ett/shared/environments';
import { map } from 'rxjs';

export interface EttConsentClient {
  name: string;
  redirectUrl: string;
}

export interface EttConsent {
  consentDate: number;
  consentId: string;
  giverOrganizationId: string;
  giverOrganizationName: string;
  giverOrganizationTin: string;
  receiverOrganizationId: string;
  receiverOrganizationName: string;
  receiverOrganizationTin: string;
}

export interface EttReceivedConsent {
  consentDate: number;
  consentId: string;
  organizationId: string;
  organizationName: string;
  organizationStatus: string;
  tin: string;
}

@Injectable({
  providedIn: 'root',
})
export class EttConsentService {
  #apiEnvironment: EttApiEnvironment = inject(ettApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #apiBase = this.#apiEnvironment.apiBase;

  getClient(thirdPartyClientId: string) {
    return this.#http.get<EttConsentClient>(
      `${this.#apiBase}/authorization/client/${thirdPartyClientId}`
    );
  }

  getOrganization(organizationId: string) {
    return this.#http.get<EttReceivedConsent>(
      `${this.#apiBase}/authorization/organization/${organizationId}`
    );
  }

  getConsents() {
    return this.#http
      .get<{ result: EttConsent[] }>(`${this.#apiBase}/authorization/consents`)
      .pipe(map((res) => res.result));
  }

  getReceivedConsents() {
    return this.#http
      .get<{
        result: EttReceivedConsent[];
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
