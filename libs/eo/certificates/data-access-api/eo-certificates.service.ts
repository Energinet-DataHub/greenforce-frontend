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
import { Observable, map } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { EoCertificate, EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';

interface EoCertificateResponse {
  result: EoCertificate[];
}

interface EoContractResponse {
  result: EoCertificateContract[];
}

@Injectable({
  providedIn: 'root',
})
export class EoCertificatesService {
  #apiBase: string;

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  getCertificates() {
    const walletApiBase = `${this.#apiBase}/v1`.replace('/api', '/wallet-api');
    return this.http.get<EoCertificateResponse>(`${walletApiBase}/certificates`).pipe(
      map((response) => response.result),
      map((certificates) => {
        return certificates.map((certificate) => {
          return {
            ...certificate,
            start: certificate.start * 1000,
            end: certificate.end * 1000,
          };
        });
      })
    );
  }

  /**
   * Array of all the user's contracts for issuing granular certificates
   */
  getContracts() {
    return this.http.get<EoContractResponse>(`${this.#apiBase}/certificates/contracts`);
  }

  getContract(id: string): Observable<EoContractResponse> {
    return this.http.get<EoContractResponse>(`/api/certificates/contracts/${id}`);
  }

  /**
   * @param gsrn ID of meteringpoint
   * Sends request to create a GC contract for a specific meteringpoint
   */
  createContract(gsrn: string) {
    return this.http.post<EoCertificateContract>(`${this.#apiBase}/certificates/contracts`, {
      gsrn,
      startDate: Math.floor(new Date().getTime() / 1000),
    });
  }

  patchContract(id: string) {
    return this.http.put<EoCertificateContract>(`${this.#apiBase}/certificates/contracts/${id}`, {
      endDate: Math.floor(Date.now() / 1000),
    });
  }
}
