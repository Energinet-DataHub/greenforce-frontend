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

export interface EoOriginOfEnergyResponse {
  energySources: [
    {
      dateFrom: number;
      dateTo: number;
      renewable: number;
      ratios: {
        wood: number;
        waste: number;
        straw: number;
        oil: number;
        naturalGas: number;
        coal: number;
        bioGas: number;
        solar: number;
        windOnshore: number;
        windOffshore: number;
      };
    }
  ];
}

@Injectable({
  providedIn: 'root',
})
export class EoOriginOfEnergyService {
  #apiBase: string;

  getSourcesFor2021() {
    return this.http.get<EoOriginOfEnergyResponse>(
      `${
        this.#apiBase
      }/sources?dateFrom=1609459200&dateTo=1640995199&aggregation=Total`,
      { withCredentials: true }
    );
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
