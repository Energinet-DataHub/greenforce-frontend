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
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';
import { EoCertificate, EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';
import { toKWh } from '@energinet-datahub/eo/shared/utilities';

interface EoCertificateResponse {
  result: EoCertificate[];
}

interface EoContractResponse {
  result: EoCertificateContract[];
}

interface EoAggregateCertificateResponse {
  result: [
    {
      start: number;
      end: number;
      quantity: number;
    }
  ];
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
    return this.http.get<EoCertificateResponse>(`${this.#apiBase}/certificates`);
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

  getAggregatedCertificates(
    timeAggregate: EoTimeAggregate,
    start: number,
    end: number,
    state: 'available' | 'total' = 'total',
    type: 'consumption' | 'production' = 'consumption'
  ) {
    const apiBase = `${this.#apiBase}/v1`.replace('/api', '/wallet-api');
    return this.http
      .get<EoAggregateCertificateResponse>(
        `${apiBase}/aggregate-certificates?timeAggregate=${timeAggregate}&start=${start}&end=${end}&type=${type}&state=${state}`
      )
      .pipe(
        map((response) => response.result),
        map((result) => result.map((x) => x.quantity)),
        map((x) => x.map((quantity) => toKWh(quantity, 'Wh')))
      );
  }

  patchContract(id: string) {
    return this.http.patch<EoCertificateContract>(`${this.#apiBase}/certificates/contracts/${id}`, {
      endDate: Math.floor(Date.now() / 1000),
    });
  }
}
