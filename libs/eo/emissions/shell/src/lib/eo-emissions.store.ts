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
import { ComponentStore } from '@ngrx/component-store';
import { take } from 'rxjs';
import { EoEmissionsService } from './eo-emissions.service';

interface EoEmissions {
  /** Unix timestamp */
  dateFrom: number;
  /** Unix timestamp */
  dateTo: number;
  /** SI value of the total emissions for the selected dates */
  total: { unit: string; value: number };
  /** SI value of the relative emissions for the selected dates */
  relative: { unit: string; value: number };
}

interface EoEmissionsState {
  loadingDone: boolean;
  emissions: EoEmissions;
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoEmissionsStore extends ComponentStore<EoEmissionsState> {
  constructor(private service: EoEmissionsService) {
    super({
      loadingDone: false,
      emissions: {
        dateFrom: 0,
        dateTo: 0,
        total: { unit: '', value: 0 },
        relative: { unit: '', value: 0 },
      },
      error: null,
    });

    this.loadData();
  }

  readonly total$ = this.select((state) => state.emissions.total);
  readonly relative$ = this.select((state) => state.emissions.relative);
  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly emissions$ = this.select((state) => state.emissions);
  readonly error$ = this.select((state) => state.error);

  readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoEmissionsState => ({
      ...state,
      loadingDone,
    })
  );

  readonly setEmissions = this.updater(
    (state, emissions: EoEmissions): EoEmissionsState => ({
      ...state,
      emissions,
    })
  );

  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoEmissionsState => ({
      ...state,
      error,
    })
  );

  loadData() {
    this.service
      .getEmissionsFor2021()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.setEmissions(response.emissions[0]);
          this.setError(null);
          this.setLoadingDone(true);
        },
        error: (error) => {
          this.setError(error);
          this.setLoadingDone(true);
        },
      });
  }
}
