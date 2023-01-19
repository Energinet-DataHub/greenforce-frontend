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
import {
  EoCertificateContract,
  EoCertificatesService,
} from 'libs/eo/certificates/src/lib/eo-certificates.service';
import { forkJoin } from 'rxjs';
import {
  EoMeteringPointsService,
  MeteringPoint,
} from './eo-metering-points.service';

export interface EoMeteringPoint extends MeteringPoint {
  /** Granular certificate contract on metering point */
  contract?: EoCertificateContract;
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
  constructor(
    private service: EoMeteringPointsService,
    private certService: EoCertificatesService
  ) {
    super({
      loadingDone: false,
      meteringPoints: [],
      error: null,
    });

    this.loadData();
  }

  readonly loadingDone$ = this.select((state) => state.loadingDone);
  private readonly setLoadingDone = this.updater(
    (state, loadingDone: boolean): EoMeteringPointsState => ({
      ...state,
      loadingDone,
    })
  );

  readonly meteringPoints$ = this.select((state) => state.meteringPoints);
  private readonly setMeteringPoints = this.updater(
    (state, meteringPoints: EoMeteringPoint[]): EoMeteringPointsState => ({
      ...state,
      meteringPoints,
    })
  );

  private readonly setCertificateContract = this.updater(
    (state, contract: EoCertificateContract): EoMeteringPointsState => ({
      ...state,
      meteringPoints: state.meteringPoints.map((mp) => {
        if (mp.gsrn === contract.gsrn) {
          mp.contract = contract;
        }
        return mp;
      }),
    })
  );

  readonly error$ = this.select((state) => state.error);
  private readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoMeteringPointsState => ({
      ...state,
      error,
    })
  );

  loadData() {
    forkJoin([
      this.certService.getContracts(),
      this.service.getMeteringPoints(),
    ]).subscribe({
      next: ([contractList, mpList]) => {
        this.setMeteringPoints(
          mpList.meteringPoints.map((mp: MeteringPoint) => ({
            ...mp,
            contract: contractList.result.find(
              (contract) => contract.gsrn === mp.gsrn
            ),
          }))
        );
        this.setLoadingDone(true);
      },
      error: (error) => {
        this.setError(error);
        this.setLoadingDone(true);
      },
    });
  }

  createCertificateContract(gsrn: string) {
    this.certService.createContract(gsrn).subscribe({
      next: (contract) => this.setCertificateContract(contract),
      error: (error) => {
        this.setError(error);
        this.loadData();
      },
    });
  }
}
