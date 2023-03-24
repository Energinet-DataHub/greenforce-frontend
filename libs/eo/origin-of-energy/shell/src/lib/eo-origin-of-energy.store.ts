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
import { EoOriginOfEnergyService } from './eo-origin-of-energy.service';

interface EoOriginOfEnergy {
  /** Unix timestamp */
  dateFrom: number;
  /** Unix timestamp */
  dateTo: number;
  /** Share of renewable energy in decimal form */
  renewable: number;
  /** Share of energy types in decimal form */
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

interface EoOriginOfEnergyState {
  loadingDone: boolean;
  energySources: EoOriginOfEnergy[];
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoOriginOfEnergyStore extends ComponentStore<EoOriginOfEnergyState> {
  constructor(private service: EoOriginOfEnergyService) {
    super({
      loadingDone: false,
      energySources: [],
      error: null,
    });
    this.loadData();
  }

  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly renewableTotal$ = this.select(
    (state) =>
      state.energySources.reduce((acc, obj) => acc + obj.renewable, 0) / state.energySources.length
  );
  readonly error$ = this.select((state) => state.error);

  readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoOriginOfEnergyState => ({
      ...state,
      loadingDone,
    })
  );

  readonly setEnergySources = this.updater(
    (state, energySources: EoOriginOfEnergy[]): EoOriginOfEnergyState => ({
      ...state,
      energySources,
    })
  );

  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoOriginOfEnergyState => ({
      ...state,
      error,
    })
  );

  loadData() {
    this.setLoadingDone(false);

    this.service
      .getSourcesFor2021()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.setEnergySources(response.energySources);
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
