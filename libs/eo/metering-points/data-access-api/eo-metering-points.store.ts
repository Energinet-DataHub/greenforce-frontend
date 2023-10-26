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
import { ComponentStore } from '@ngrx/component-store';
import { filter, forkJoin, map, Observable, switchMap, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';
import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoMeteringPoint } from '@energinet-datahub/eo/metering-points/domain';
import { EoMeteringPointType } from '@energinet-datahub/eo/shared/domain';
import {
  MeteringPoint,
  EoMeteringPointsService,
} from '@energinet-datahub/eo/metering-points/data-access-api';

interface EoMeteringPointsState {
  loading: boolean;
  meteringPoints: EoMeteringPoint[];
  meteringPointError: HttpErrorResponse | null;
  contractError: HttpErrorResponse | null;
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
      loading: true,
      meteringPoints: [],
      meteringPointError: null,
      contractError: null,
    });
  }

  readonly loading$ = this.select((state) => state.loading);
  private readonly setLoading = this.updater(
    (state, loading: boolean): EoMeteringPointsState => ({ ...state, loading })
  );

  readonly meteringPoints$ = this.select((state) => state.meteringPoints);
  private readonly setMeteringPoints = this.updater(
    (state, meteringPoints: EoMeteringPoint[]): EoMeteringPointsState => ({
      ...state,
      meteringPoints,
      meteringPointError: null,
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

  private readonly updateMeteringPointContract = this.updater(
    (state, contract: { gsrn: string; active: boolean }): EoMeteringPointsState => ({
      ...state,
      meteringPoints: state.meteringPoints.map((meteringPoint) => {
        if (meteringPoint.gsrn !== contract.gsrn) return meteringPoint;

        return {
          ...meteringPoint,
          contract: contract.active ? this.generateActiveContract(contract.gsrn) : undefined,
        };
      }),
    })
  );

  private generateActiveContract(gsrn: string): EoCertificateContract {
    return {
      gsrn,
      created: Math.floor(Date.now() / 1000),
      id: '',
      startDate: Math.floor(Date.now() / 1000),
      endDate: null,
    };
  }

  private readonly toggleContractLoading = this.updater(
    (state, gsrn: string): EoMeteringPointsState => ({
      ...state,
      meteringPoints: state.meteringPoints.map((mp) =>
        mp.gsrn === gsrn ? { ...mp, loadingContract: !mp.loadingContract } : mp
      ),
    })
  );

  readonly meteringPointError$ = this.select((state) => state.meteringPointError);
  readonly contractError$ = this.select((state) => state.contractError);

  private isActiveContract(contract: EoCertificateContract | undefined): boolean {
    if (!contract) return false;
    const now = Math.floor(Date.now() / 1000);

    return (
      (!contract.startDate || contract.startDate <= now) &&
      (!contract.endDate || contract.endDate >= now)
    );
  }

  loadMeteringPoints() {
    this.setLoading(true);
    forkJoin([this.certService.getContracts(), this.service.getMeteringPoints()]).subscribe({
      next: ([contractList, mpList]) => {
        this.setLoading(false);
        this.setMeteringPoints(
          mpList.meteringPoints?.map((mp: MeteringPoint) => ({
            ...mp,
            contract: contractList?.result.find(
              (contract) => contract.gsrn === mp.gsrn && this.isActiveContract(contract)
            ),
            loadingContract: false,
          }))
        );
      },
      error: (error) => {
        this.setLoading(false);
        this.patchState({ meteringPointError: error });
      },
    });
  }

  private getContractIdForGsrn(gsrn: string): Observable<string | null> {
    return this.meteringPoints$.pipe(
      take(1),
      map((meteringPoints) => meteringPoints.find((mp) => mp.gsrn === gsrn)?.contract?.id || null)
    );
  }

  createCertificateContract(gsrn: string) {
    this.toggleContractLoading(gsrn);
    this.certService.createContract(gsrn).subscribe({
      next: (contract) => {
        this.setContract(contract);
        this.toggleContractLoading(gsrn);
        this.patchState({ contractError: null });
      },
      error: (error) => {
        this.patchState({ contractError: error });
        this.toggleContractLoading(gsrn);
      },
    });
  }

  deactivateCertificateContract(gsrn: string): void {
    this.toggleContractLoading(gsrn);
    this.getContractIdForGsrn(gsrn)
      .pipe(
        filter((id): id is string => !!id),
        switchMap((id) => this.certService.patchContract(id))
      )
      .subscribe({
        next: () => {
          this.updateMeteringPointContract({ gsrn, active: false });
          this.toggleContractLoading(gsrn);
          this.patchState({ contractError: null });
        },
        error: (error) => {
          this.toggleContractLoading(gsrn);
          this.patchState({ contractError: error });
        },
      });
  }
}
