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
import { EoMeteringPointsService } from './eo-metering-points.service';

export interface EoMeteringPoint {
  /** Unique ID of the metering point - Global Service Relation Number */
  gsrn: string;
  /** Name of the area the metering point is registered in */
  gridArea: string;
  /** Type of metering point, ie. consumption or production */
  type: string;
  address: {
    /** Address line, ie. 'Dieselstraße 28' */
    address1: string;
    /** Extra address line for floor, side and such, ie. '3. Stock */
    address2: string | null;
    /** Local area description, ie. 'Niedersachsen' */
    locality: string | null;
    /** City name, ie. 'Wolfsburg' */
    city: string;
    /** Postcode, ie. '38446' */
    postalCode: string;
    /** Country-code, ie. 'DE' */
    country: string;
  };
}

interface EoMeteringPointsState {
  loadingDone: boolean;
  meteringPoints: EoMeteringPoint[];
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoMeteringPointsStore extends ComponentStore<EoMeteringPointsState> {
  constructor(private service: EoMeteringPointsService) {
    super({
      loadingDone: false,
      meteringPoints: [],
      error: null,
    });

    this.loadData();
  }

  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly meteringPoints$ = this.select((state) => state.meteringPoints);
  readonly error$ = this.select((state) => state.error);

  readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoMeteringPointsState => ({
      ...state,
      loadingDone,
    })
  );

  readonly setEnergySources = this.updater(
    (state, meteringPoints: EoMeteringPoint[]): EoMeteringPointsState => ({
      ...state,
      meteringPoints,
    })
  );

  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoMeteringPointsState => ({
      ...state,
      error,
    })
  );

  loadData() {
    this.service
      .getMeteringPoints()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.setEnergySources(response.meteringPoints);
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
