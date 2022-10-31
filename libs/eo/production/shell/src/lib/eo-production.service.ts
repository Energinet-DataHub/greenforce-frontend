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
import {
  AppSettingsStore,
  CalendarDateRange,
} from '@energinet-datahub/eo/shared/services';
import { take } from 'rxjs';

export interface EoMeasurement {
  dateFrom: number;
  dateTo: number;
  value: number;
}

interface EoProductionResponse {
  measurements: EoMeasurement[];
}

@Injectable({
  providedIn: 'root',
})
export class EoProductionService {
  #apiBase: string;

  getMonthlyProduction() {
    let dateRange: CalendarDateRange = {} as CalendarDateRange;

    this.store.calendarDateRangeInSeconds$
      .pipe(take(1))
      .subscribe((datesInSeconds) => (dateRange = datesInSeconds));

    return this.http.get<EoProductionResponse>(
      `${this.#apiBase}/measurements/production?dateFrom=${
        dateRange.start
      }&dateTo=${dateRange.end}&aggregation=Month`,
      { withCredentials: true }
    );
  }

  constructor(
    private http: HttpClient,
    private store: AppSettingsStore,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
