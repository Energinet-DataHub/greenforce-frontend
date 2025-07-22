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
import { EttApiEnvironment, ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';

interface MeteringPointsResponse {
  result: [];
}

interface StartClaimResponse {
  subjectId: string;
}

@Injectable({
  providedIn: 'root',
})
export class EttMeteringPointsService {
  private http = inject(HttpClient);
  private apiEnvironment = inject<EttApiEnvironment>(ettApiEnvironmentToken);

  #apiBase: string;

  getMeteringPoints() {
    return this.http.get<MeteringPointsResponse>(`${this.#apiBase}/measurements/meteringpoints`);
  }

  startClaim() {
    return this.http.post<StartClaimResponse>(`${this.#apiBase}/claim-automation/start`, {});
  }

  stopClaim() {
    return this.http.delete(`${this.#apiBase}/claim-automation/stop`);
  }

  constructor() {
    this.#apiBase = `${this.apiEnvironment.apiBase}`;
  }
}
