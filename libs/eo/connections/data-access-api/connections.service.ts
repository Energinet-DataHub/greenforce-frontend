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
import { Observable, forkJoin, map, mergeMap } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

import { EoCvrService } from './cvr.service';

export interface EoConnection {
  id: string;
  companyId: string;
  companyTin: string;
}

export interface EoConnectionWithName extends EoConnection {
  companyName: string;
}

interface ConnectionsResponse {
  result: EoConnection[];
}

@Injectable({
  providedIn: 'root',
})
export class EoConnectionsService {
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #cvrService: EoCvrService = inject(EoCvrService);

  #apiBase = `${this.#apiEnvironment.apiBase}`;

  getConnections(): Observable<EoConnectionWithName[]> {
    return this.#http.get<ConnectionsResponse>(`${this.#apiBase}/connections`).pipe(
      map((response) => response?.result),
      mergeMap((connections) => {
        const updatedItems$ = connections.map((connection) => {
          return this.#cvrService.getCompanyName(connection.companyTin).pipe(
            map((companyName) => {
              return {
                ...connection,
                companyName,
              };
            })
          );
        });
        return forkJoin(updatedItems$);
      })
    );
  }

  deleteConnection(connectionId: string) {
    return this.#http.delete(`${this.#apiBase}/connections/${connectionId}`);
  }
}
