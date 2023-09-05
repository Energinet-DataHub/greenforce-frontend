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
import { Observable, delay, map } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

export interface EoConnection {
  id: string;
  name: string;
}

interface MeteringPointsResponse {
  meteringPoints: [];
}

interface ConnectionsResponse {
  connections: EoConnection[];
}

@Injectable({
  providedIn: 'root',
})
export class EoConnectionsService {
  #apiBase: string;

  getConnections(): Observable<ConnectionsResponse> {
    return this.http.get<MeteringPointsResponse>(`${this.#apiBase}/meteringpoints`).pipe(
      // TODO: REMOVE THIS MAP
      map((response) => {
        return {
          connections: response.meteringPoints.map((connection, index) => ({ id: 'MOCKED ID ' + index, name: 'MOCKED NAME ' + index }))
        };
      }),
      delay(500) // TODO: REMOVE THIS DELAY
    );
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
