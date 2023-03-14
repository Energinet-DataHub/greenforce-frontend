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
import { EoCertificateContract, EoCertificatesService } from '@energinet-datahub/eo/certificates';
import { ComponentStore } from '@ngrx/component-store';
import { forkJoin } from 'rxjs';
import { EoMeteringPointsService, MeteringPoint } from './eo-metering-points.service';

export interface EoMeteringPoint extends MeteringPoint {
  /** Granular certificate contract on metering point */
  contract?: EoCertificateContract;
  /** Indicates whether a contract status is loading for the meteringpoint */
  loadingContract: boolean;
}

interface EoMeteringPointsState {
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
      meteringPoints: [],
      error: null,
    });

    this.loadData();
  }

  readonly meteringPoints$ = this.select((state) => state.meteringPoints);
  private readonly setMeteringPoints = this.updater(
    (state, meteringPoints: EoMeteringPoint[]): EoMeteringPointsState => ({
      ...state,
      meteringPoints,
    })
  );

  private readonly setContract = this.updater(
    (state, contract: EoCertificateContract): EoMeteringPointsState => ({
      ...state,
      meteringPoints: state.meteringPoints.map((mp) =>
        mp.gsrn === contract.gsrn ? { ...mp, contract } : mp
      ),
    })
  );

  private readonly setContractLoading = this.updater(
    (state, gsrn: string): EoMeteringPointsState => ({
      ...state,
      meteringPoints: state.meteringPoints.map((mp) =>
        mp.gsrn === gsrn ? { ...mp, loadingContract: !mp.loadingContract } : mp
      ),
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
    forkJoin([this.certService.getContracts(), this.service.getMeteringPoints()]).subscribe({
      next: ([contractList, mpList]) => {
        this.setMeteringPoints(
          mpList.meteringPoints.map((mp: MeteringPoint) => ({
            ...mp,
            contract: contractList?.result.find((contract) => contract.gsrn === mp.gsrn),
            loadingContract: false,
          }))
        );
      },
      error: (error) => {
        this.setError(error);
      },
    });
  }

  createCertificateContract(gsrn: string) {
    this.setContractLoading(gsrn);
    this.certService.createContract(gsrn).subscribe({
      next: (contract) => {
        this.setContract(contract);
        this.setContractLoading(gsrn);
      },
      error: (error) => {
        this.setError(error);
        this.setContractLoading(gsrn);
      },
    });
  }
}
