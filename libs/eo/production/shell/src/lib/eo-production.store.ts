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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsStore } from '@energinet-datahub/eo/shared/services';
import { ComponentStore } from '@ngrx/component-store';
import { Subscription, take } from 'rxjs';
import { EoMeasurement, EoProductionService } from './eo-production.service';

export interface EoMeasurementData {
  /** Name of month */
  name: string;
  /** Value of the total production for the selected dates, in watt hours */
  value: number;
}

interface EoProductionState {
  loadingDone: boolean;
  measurements: EoMeasurementData[];
  totalMeasurement: number;
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoProductionStore extends ComponentStore<EoProductionState> {
  monthlyProductionApiCall: Subscription = new Subscription();

  constructor(
    private service: EoProductionService,
    private appSettingsStore: AppSettingsStore
  ) {
    super({
      loadingDone: false,
      measurements: [],
      totalMeasurement: 0,
      error: null,
    });

    this.appSettingsStore.calendarDateRange$.subscribe(() => {
      this.loadMonthlyProduction();
    });
  }

  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly measurements$ = this.select((state) => state.measurements);
  readonly totalMeasurement$ = this.select((state) => state.totalMeasurement);
  readonly error$ = this.select((state) => state.error);

  readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoProductionState => ({
      ...state,
      loadingDone,
    })
  );

  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoProductionState => ({
      ...state,
      error,
    })
  );

  readonly setTotalMeasurement = this.updater(
    (state, totalMeasurement: number): EoProductionState => ({
      ...state,
      totalMeasurement,
    })
  );

  readonly setMonthlyMeasurements = this.updater(
    (state, measurements: EoMeasurementData[]): EoProductionState => ({
      ...state,
      measurements,
    })
  );

  loadMonthlyProduction() {
    this.setLoadingDone(false);
    this.monthlyProductionApiCall.unsubscribe();

    this.monthlyProductionApiCall = this.service
      .getMonthlyProduction()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          const measurements = this.getMeasurementsFromData(
            result.measurements
          );

          this.setMonthlyMeasurements(measurements);
          this.setTotalMeasurement(this.getTotalFromArray(measurements));
          this.setError(null);
        },
        error: (error) => {
          this.setError(error);
        },
        complete: () => {
          this.setLoadingDone(true);
        },
      });
  }

  getMeasurementsFromData(array: EoMeasurement[]): EoMeasurementData[] {
    return array.map((measure) => {
      return {
        name: new Date(measure.dateFrom * 1000).toLocaleString('en-us', {
          month: 'short',
        }),
        value: measure.value,
      };
    });
  }

  getTotalFromArray(array: EoMeasurementData[]): number {
    return array.reduce((total, obj) => total + obj.value, 0);
  }
}
