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
import { EMPTY, filter, forkJoin, map, Observable, of, switchMap, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';
import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoMeteringPoint, AibTechCode } from '@energinet-datahub/eo/metering-points/domain';

import { MeteringPoint } from '@energinet-datahub/eo/metering-points/domain';

import { EoMeteringPointsService } from './eo-metering-points.service';

interface EoMeteringPointsState {
  loading: boolean;
  meteringPoints: EoMeteringPoint[];
  meteringPointError: HttpErrorResponse | null;
  contractError: HttpErrorResponse | null;
  relationStatus: 'Created' | 'Pending' | null;
  creatingContracts: boolean;
  deativatingContracts: boolean;
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
      relationStatus: null,
      creatingContracts: false,
      deativatingContracts: false,
    });
  }

  readonly loading$ = this.select((state) => state.loading);
  readonly relationStatus$ = this.select((state) => state.relationStatus);
  readonly creatingContracts$ = this.select((state) => state.creatingContracts);
  readonly deativatingContracts$ = this.select((state) => state.deativatingContracts);

  private readonly setLoading = this.updater(
    (state, loading: boolean): EoMeteringPointsState => ({ ...state, loading })
  );

  readonly meteringPoints$ = this.select((state) => state.meteringPoints);
  readonly consumptionMeteringPoints$ = this.select(
    (state) =>
      state.meteringPoints?.filter(
        (mp) =>
          mp.type === 'Consumption' &&
          (mp.technology.aibTechCode === AibTechCode.Wind ||
            mp.technology.aibTechCode === AibTechCode.Solar)
      ) ?? []
  );
  readonly productionMeteringPoints$ = this.select(
    (state) =>
      state.meteringPoints?.filter(
        (mp) =>
          mp.type === 'Production' &&
          (mp.technology.aibTechCode === AibTechCode.Wind ||
            mp.technology.aibTechCode === AibTechCode.Solar)
      ) ?? []
  );
  readonly productionAndConsumptionMeteringPoints$ = this.select((state) => {
    return (
      state.meteringPoints?.filter(
        (mp) =>
          (mp.type === 'Production' || mp.type === 'Consumption') &&
          (mp.technology.aibTechCode === AibTechCode.Wind ||
            mp.technology.aibTechCode === AibTechCode.Solar)
      ) ?? []
    );
  });

  readonly consumptionMeteringPointsWithContract$ = this.select(
    (state) =>
      state.meteringPoints?.filter((mp) => mp.type === 'Consumption' && !!mp.contract) ?? []
  );

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

  private readonly removeContract = this.updater(
    (state, id: string): EoMeteringPointsState => ({
      ...state,
      meteringPoints: state.meteringPoints.map((mp) => {
        if (mp.contract?.id === id) {
          return { ...mp, contract: undefined };
        }
        return mp;
      }),
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
          mpList.result?.map((mp: MeteringPoint) => ({
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

  createCertificateContracts(meteringPoints: EoMeteringPoint[]) {
    const hasConsumptionMeteringPoint = meteringPoints.some(meteringPoint => meteringPoint.type === 'Consumption');

    const createContract$ =
      hasConsumptionMeteringPoint ? this.service.startClaim() : of(EMPTY);

    this.patchState({ creatingContracts: true });

    (createContract$ as Observable<unknown>)
      .pipe(switchMap(() => this.certService.createContracts(meteringPoints)))
      .subscribe({
        next: (contracts) => {
          contracts.forEach(contract => {
            this.setContract(contract);
          });
          this.patchState({ contractError: null, creatingContracts: false });
        },
        error: (error) => {
          this.patchState({ contractError: error, creatingContracts: false });
        },
      });
  }

  deactivateCertificateContracts(meteringPoints: EoMeteringPoint[]): void {
    const deactivateConsumptionContract$ = this.consumptionMeteringPointsWithContract$.pipe(
      take(1),
      switchMap((consumptionMeteringPointsWithContract) => {
        return consumptionMeteringPointsWithContract.length <= 1
          ? this.service.stopClaim()
          : of(EMPTY);
      })
    );

    const hasConsumptionMeteringPoint = meteringPoints.some(meteringPoint => meteringPoint.type === 'Consumption');
    const deactivateContract$ =
    hasConsumptionMeteringPoint ? deactivateConsumptionContract$ : of(EMPTY);

    this.patchState({ deativatingContracts: true });

    deactivateContract$
      .pipe(
        switchMap(() => this.certService.patchContracts(meteringPoints))
      )
      .subscribe({
        next: () => {
          meteringPoints.forEach(meteringPoint => {
            const contractId = meteringPoint.contract?.id;
            if (!contractId) return;
            this.removeContract(contractId);
          });
          this.patchState({ contractError: null, deativatingContracts: false });
        },
        error: (error) => {
          this.patchState({ contractError: error, deativatingContracts: false });
        },
      });
  }
}
