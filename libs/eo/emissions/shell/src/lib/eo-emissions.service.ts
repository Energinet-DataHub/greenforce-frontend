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
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { CalendarDateRange } from '@energinet-datahub/eo/shared/services';

interface EoEmissionsResponse {
  emissions: [
    {
      dateFrom: number;
      dateTo: number;
      total: {
        unit: string;
        value: number;
      };
      relative: {
        unit: string;
        value: number;
      };
    }
  ];
}

@Injectable({
  providedIn: 'root',
})
export class EoEmissionsService {
  #apiBase: string;

  getEmissionsFor2021() {
    const dateRange: CalendarDateRange = {
      start: new Date('2021-01-01').getTime() / 1000,
      end: new Date('2022-01-01').getTime() / 1000,
    };
    const encodedTimeZone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

    return this.http.get<EoEmissionsResponse>(
      `${this.#apiBase}/emissions?dateFrom=${dateRange.start}&dateTo=${
        dateRange.end
      }&timeZone=${encodedTimeZone}&aggregation=Total`,
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
