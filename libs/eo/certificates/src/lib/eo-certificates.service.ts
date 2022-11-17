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
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { of } from 'rxjs';

export interface EoCertificate {
  dateFrom: number;
  dateTo: number;
  quantity: number;
  gsrn: string;
  techCode: string;
  fuelCode: string;
  id: string;
  gridArea: string;
}

interface EoCertificateResponse {
  result: EoCertificate[];
}

@Injectable({
  providedIn: 'root',
})
export class EoCertificatesService {
  #apiBase: string;
  #mockCert: EoCertificate = {
    gridArea: 'DK1',
    dateFrom: 1668606049,
    dateTo: 1668609649,
    fuelCode: 'T123123123',
    gsrn: '12312312312312312312312',
    id: 'soidjowidjoijd21',
    quantity: 123123,
    techCode: 'Fe12412e12124',
  };

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  getCertificates() {
    return of({ result: [this.#mockCert] });
    /* return this.http.get<EoCertificateResponse>(
      `${this.#apiBase}/certificates`,
      { withCredentials: true }
    ); */
  }
}
