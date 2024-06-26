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
import { Injectable, inject } from '@angular/core';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { map } from 'rxjs';

export interface EoConsentClient {
  name: string;
  redirectUrl: string;
}

export interface EoConsent {
  clientName: string;
  consentDate: number;
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

  getConsents() {
    return this.#http
      .get<{ result: EoConsent[] }>(`${this.#apiBase}/authorization/consents`)
      .pipe(map((res) => res.result));
  }

  grant(thirdPartyClientId: string) {
    return this.#http.post(`${this.#apiBase}/authorization/consent/grant`, {
      idpClientId: thirdPartyClientId,
    });
  }
}
