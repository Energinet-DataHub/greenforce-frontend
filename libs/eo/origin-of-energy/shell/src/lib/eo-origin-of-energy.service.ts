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
import { map, Observable } from 'rxjs';

export interface EoOriginOfEnergyResponse {
  energysources: [
    {
      dateFrom: number;
      dateTo: number;
      renewable: number;
      source: {
        wood: number;
        waste: number;
        straw: number;
        oil: number;
        naturalGas: number;
        coal: number;
        biogas: number;
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

  getRenewableShare(): Observable<number> {
    return this.http
      .get<EoOriginOfEnergyResponse>(
        `${
          this.#apiBase
        }/sources?dateFrom=1609455600&dateTo=1640991599&aggregation=Total`,
        { withCredentials: true }
      )
      .pipe(map((response) => response.energysources[0].renewable));
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
