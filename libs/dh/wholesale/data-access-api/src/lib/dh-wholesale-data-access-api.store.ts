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
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, Subject, map, tap, filter } from 'rxjs';

import {
  WholesaleBatchHttp,
  MarketParticipantGridAreaHttp,
  WholesaleBatchRequestDto,
  WholesaleProcessType,
  WholesaleBatchSearchDtoV2,
  WholesaleBatchState,
  WholesaleBatchDto,
  MarketParticipantGridAreaDto,
  WholesaleProcessStepResultRequestDtoV3,
  WholesaleProcessStepResultDto,
  WholesaleActorDto,
  WholesaleTimeSeriesType,
  WholesaleMarketRole,
  MarketParticipantHttp,
  MarketParticipantFilteredActorDto,
} from '@energinet-datahub/dh/shared/domain';
import { batch } from '@energinet-datahub/dh/wholesale/domain';

import type { WattBadgeType } from '@energinet-datahub-types/watt/badge';

interface State {
  batches?: batch[];
  gridAreas?: MarketParticipantGridAreaDto[];
  processStepResults?: WholesaleProcessStepResultDto;
  loadingBatches: boolean;
  loadingSettlementReports: boolean;
  selectedBatch?: batch;
  selectedGridArea?: MarketParticipantGridAreaDto;
  loadingCreatingBatch: boolean;
  actors?: WholesaleActorDto[];
  filteredActors?: MarketParticipantFilteredActorDto[];
}

const initialState: State = {
  loadingBatches: false,
  loadingSettlementReports: false,
  loadingCreatingBatch: false,
};

@Injectable({
  providedIn: 'root',
})
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  batches$ = this.select((x) => x.batches);
  gridAreas$ = this.select((x) => x.gridAreas).pipe(
    // Ensure gridAreas$ will not emit undefined, which will cause no loading indicator to be shown
    filter((x) => !!x)
  );
  selectedBatch$ = this.select((x) => x.selectedBatch);
  selectedGridArea$ = this.select((x) => x.selectedGridArea);
  processStepResults$ = this.select((x) => x.processStepResults);
  actors$ = this.select((x) => x.actors);
  filteredActors$ = this.select((x) => x.filteredActors);

  creatingBatchSuccessTrigger$: Subject<void> = new Subject();
  creatingBatchErrorTrigger$: Subject<void> = new Subject();

  loadingCreatingBatch$ = this.select((x) => x.loadingCreatingBatch);
  loadingBatches$ = this.select((x) => x.loadingBatches);
  loadingSettlementReports$ = this.select((x) => x.loadingSettlementReports);
  loadingGridAreasErrorTrigger$: Subject<void> = new Subject();
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();
  loadingBatchErrorTrigger$: Subject<void> = new Subject();
  loadingBasisDataErrorTrigger$: Subject<void> = new Subject();
  loadingProcessStepResultsErrorTrigger$: Subject<void> = new Subject();
  loadingActorsErrorTrigger$: Subject<void> = new Subject();
  loadingFilteredActorsErrorTrigger$: Subject<void> = new Subject();

  private document = inject(DOCUMENT);
  private httpClient = inject(WholesaleBatchHttp);
  private marketParticipantGridAreaHttpClient = inject(MarketParticipantGridAreaHttp);
  private marketParticipantHttp = inject(MarketParticipantHttp);

  constructor() {
    super(initialState);
  }

  readonly setLoadingCreatingBatch = this.updater(
    (state, loadingCreatingBatch: boolean): State => ({
      ...state,
      loadingCreatingBatch,
    })
  );

  readonly setBatches = this.updater(
    (state, batches: batch[]): State => ({
      ...state,
      batches: batches,
      loadingBatches: false,
    })
  );

  readonly setProcessStepResults = this.updater(
    (state, processStepResults: WholesaleProcessStepResultDto | undefined): State => ({
      ...state,
      processStepResults,
    })
  );

  readonly setLoadingBatches = this.updater(
    (state, loadingBatches: boolean): State => ({
      ...state,
      loadingBatches,
    })
  );

  readonly setLoadingSettlementReports = this.updater(
    (state, loadingBatches: boolean): State => ({
      ...state,
      loadingBatches,
    })
  );

  readonly setActors = this.updater(
    (state, actors: WholesaleActorDto[]): State => ({
      ...state,
      actors,
    })
  );

  readonly setFilteredActors = this.updater(
    (state, filteredActors: MarketParticipantFilteredActorDto[]): State => ({
      ...state,
      filteredActors,
    })
  );

  readonly setGridAreas = this.updater(
    (state, gridAreas: MarketParticipantGridAreaDto[]): State => ({
      ...state,
      gridAreas,
    })
  );

  readonly createBatch = this.effect(
    (
      batch$: Observable<{
        gridAreas: string[];
        dateRange: { start: string; end: string };
        processType: WholesaleProcessType;
      }>
    ) => {
      return batch$.pipe(
        switchMap((batch) => {
          this.setLoadingCreatingBatch(true);

          const batchRequest: WholesaleBatchRequestDto = {
            processType: batch.processType,
            gridAreaCodes: batch.gridAreas,
            startDate: batch.dateRange.start,
            endDate: batch.dateRange.end,
          };

          return this.httpClient.v1WholesaleBatchPost(batchRequest).pipe(
            tapResponse(
              () => {
                this.creatingBatchSuccessTrigger$.next();
                this.setLoadingCreatingBatch(false);
              },
              () => {
                this.creatingBatchErrorTrigger$.next();
                this.setLoadingCreatingBatch(false);
              }
            )
          );
        })
      );
    }
  );

  readonly getBatches = this.effect((filter$: Observable<WholesaleBatchSearchDtoV2>) => {
    return filter$.pipe(
      switchMap((filter: WholesaleBatchSearchDtoV2) => {
        this.setLoadingBatches(true);

        return this.httpClient.v1WholesaleBatchSearchPost(filter).pipe(
          tapResponse(
            (batches) => {
              const mappedBatches = batches.map((batch) => {
                return {
                  ...batch,
                  statusType: this.getStatusType(batch.executionState),
                };
              });
              this.setBatches(mappedBatches);
            },
            () => {
              this.setLoadingBatches(false);
              this.loadingBatchesErrorTrigger$.next();
            }
          )
        );
      })
    );
  });

  readonly getBatch = this.effect((batchNumber$: Observable<string>) => {
    return batchNumber$.pipe(
      switchMap((batchNumber) => {
        return this.httpClient.v1WholesaleBatchBatchGet(batchNumber).pipe(
          tapResponse(
            (batch) => {
              this.setSelectedBatch({
                ...batch,
                statusType: this.getStatusType(batch.executionState),
              });
            },
            () => this.loadingBatchErrorTrigger$.next()
          )
        );
      })
    );
  });

  readonly getGridAreas = this.effect(() => {
    return this.marketParticipantGridAreaHttpClient
      .v1MarketParticipantGridAreaGetAllGridAreasGet()
      .pipe(
        tapResponse(
          (gridAreas) => {
            this.setGridAreas(gridAreas);
          },
          () => this.loadingGridAreasErrorTrigger$.next()
        )
      );
  });

  readonly getProcessStepResults = this.effect(
    (options$: Observable<WholesaleProcessStepResultRequestDtoV3>) => {
      return options$.pipe(
        switchMap((options) => {
          this.setProcessStepResults(undefined); // We reset the process step results to force the loading spinner to show
          return this.httpClient.v1WholesaleBatchProcessStepResultPost(options).pipe(
            tapResponse(
              (stepResults: WholesaleProcessStepResultDto) =>
                this.setProcessStepResults(stepResults),
              () => this.loadingProcessStepResultsErrorTrigger$.next()
            )
          );
        })
      );
    }
  );

  readonly getActors = this.effect(
    (
      options$: Observable<{
        batchId: string;
        gridAreaCode: string;
        marketRole: WholesaleMarketRole;
      }>
    ) => {
      return options$.pipe(
        switchMap(({ batchId, gridAreaCode, marketRole }) => {
          return this.httpClient
            .v1WholesaleBatchActorsPost({
              batchId,
              gridAreaCode,
              type: WholesaleTimeSeriesType.NonProfiledConsumption,
              marketRole,
            })
            .pipe(
              tapResponse(
                (actors) => this.setActors(actors),
                () => {
                  this.loadingActorsErrorTrigger$.next();
                }
              )
            );
        })
      );
    }
  );

  readonly getFilteredActors = this.effect(() => {
    return this.marketParticipantHttp.v1MarketParticipantOrganizationGetFilteredActorsGet().pipe(
      tapResponse(
        (filtedActors) => {
          this.setFilteredActors(filtedActors);
        },
        () => this.loadingFilteredActorsErrorTrigger$.next()
      )
    );
  });

  readonly getZippedBasisData = this.effect((batch$: Observable<WholesaleBatchDto>) => {
    return batch$.pipe(
      switchMap((batch) => {
        return this.httpClient.v1WholesaleBatchZippedBasisDataStreamGet(batch.batchId).pipe(
          tapResponse(
            (data) => {
              const blob = new Blob([data as unknown as BlobPart], {
                type: 'application/zip',
              });
              const basisData = window.URL.createObjectURL(blob);
              const link = this.document.createElement('a');
              link.href = basisData;
              link.download = `${batch.batchId}.zip`;
              link.click();
            },
            () => this.loadingBasisDataErrorTrigger$.next()
          )
        );
      })
    );
  });

  readonly setSelectedBatch = this.updater(
    (state, batch: batch | undefined): State => ({
      ...state,
      selectedBatch: batch,
      processStepResults: undefined,
    })
  );

  readonly setSelectedGridArea = this.updater(
    (state, gridArea: MarketParticipantGridAreaDto | undefined): State => ({
      ...state,
      selectedGridArea: gridArea,
    })
  );

  readonly getGridArea$ = (
    gridAreaCode: string
  ): Observable<MarketParticipantGridAreaDto | undefined> => {
    return this.selectedBatch$.pipe(
      map((x) => {
        return x?.gridAreas.filter(
          (gridArea: MarketParticipantGridAreaDto) => gridArea.code === gridAreaCode
        )[0];
      }),
      tap((gridArea) => this.setSelectedGridArea(gridArea))
    );
  };

  private getStatusType(status: WholesaleBatchState): WattBadgeType {
    if (status === WholesaleBatchState.Pending) {
      return 'warning';
    } else if (status === WholesaleBatchState.Completed) {
      return 'success';
    } else if (status === WholesaleBatchState.Failed) {
      return 'danger';
    } else {
      return 'info';
    }
  }
}
