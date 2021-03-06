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
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { take } from 'rxjs';
import { EoConsumptionService, EoMeasurement } from './eo-consumption.service';

export interface EoMeasurementData {
  /** Name of month */
  name: string;
  /** Value of the total consumption for the selected dates, in kWh */
  value: number;
}

interface EoConsumptionState {
  loadingDone: boolean;
  measurements: EoMeasurementData[];
  totalMeasurement: number;
}

@Injectable()
export class EoConsumptionStore extends ComponentStore<EoConsumptionState> {
  constructor(private service: EoConsumptionService) {
    super({
      loadingDone: false,
      measurements: [],
      totalMeasurement: 0,
    });

    this.loadMonthlyConsumption();
  }

  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly measurements$ = this.select((state) => state.measurements);
  readonly totalMeasurement$ = this.select((state) => state.totalMeasurement);

  readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoConsumptionState => ({
      ...state,
      loadingDone,
    })
  );

  readonly setTotalMeasurement = this.updater(
    (state, totalMeasurement: number): EoConsumptionState => ({
      ...state,
      totalMeasurement,
    })
  );

  readonly setMonthlyMeasurements = this.updater(
    (state, measurements: EoMeasurementData[]): EoConsumptionState => ({
      ...state,
      measurements,
    })
  );

  loadMonthlyConsumption() {
    this.service
      .getMonthlyConsumptionFor2021()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          const measurements = this.getMeasurementsFromData(
            result.measurements
          );

          this.setMonthlyMeasurements(measurements);
          this.setTotalMeasurement(this.getTotalFromArray(measurements));
          this.setLoadingDone(true);
        },
        error: () => {
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
