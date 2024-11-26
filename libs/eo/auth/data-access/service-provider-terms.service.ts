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
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { map } from 'rxjs';

interface ServiceProviderTermsResponse {
  termsAccepted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTermsService {
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #apiBase = this.#apiEnvironment.apiBase;
  private currentVersion = -1;
  public serviceProviderTermsAccepted = signal(false);

  constructor() {
    this.getServiceProviderTerms();
  }

  private getServiceProviderTerms() {
    return this.#http
      .get<ServiceProviderTermsResponse>(`${this.#apiBase}/authorization/service-provider-terms`)
      .pipe(map((x) => x.termsAccepted))
      .subscribe((termsAccepted) => {
        this.serviceProviderTermsAccepted.set(termsAccepted);
      });
  }

  acceptServiceProviderTerms() {
    return this.#http.post(`${this.#apiBase}/authorization/service-provider-terms`, null);
  }
}
