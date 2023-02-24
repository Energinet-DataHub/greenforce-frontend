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
  BatchRequestDto,
  ProcessType,
  BatchSearchDtoV2,
  BatchState,
  BatchDto,
  GridAreaDto,
  ProcessStepResultRequestDtoV3,
  ProcessStepResultDto,
  WholesaleActorDto,
  TimeSeriesType,
  MarketRole,
} from '@energinet-datahub/dh/shared/domain';
import {
  batch,
  settlementReportsProcess,
  SettlementReportsProcessFilters,
} from '@energinet-datahub/dh/wholesale/domain';

import type { WattBadgeType } from '@energinet-datahub-types/watt/badge';

interface State {
  batches?: batch[];
  settlementReports?: settlementReportsProcess[];
  gridAreas?: GridAreaDto[];
  processStepResults?: ProcessStepResultDto;
  loadingBatches: boolean;
  loadingSettlementReports: boolean;
  selectedBatch?: batch;
  selectedGridArea?: GridAreaDto;
  loadingCreatingBatch: boolean;
  actors?: WholesaleActorDto[];
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
  settlementReports$ = this.select((x) => x.settlementReports);
  gridAreas$ = this.select((x) => x.gridAreas).pipe(
    // Ensure gridAreas$ will not emit undefined, which will cause no loading indicator to be shown
    filter((x) => !!x)
  );
  selectedBatch$ = this.select((x) => x.selectedBatch);
  selectedGridArea$ = this.select((x) => x.selectedGridArea);
  processStepResults$ = this.select((x) => x.processStepResults);
  actors$ = this.select((x) => x.actors);

  creatingBatchSuccessTrigger$: Subject<void> = new Subject();
  creatingBatchErrorTrigger$: Subject<void> = new Subject();

  loadingCreatingBatch$ = this.select((x) => x.loadingCreatingBatch);
  loadingBatches$ = this.select((x) => x.loadingBatches);
  loadingSettlementReports$ = this.select((x) => x.loadingSettlementReports);
  loadingGridAreasErrorTrigger$: Subject<void> = new Subject();
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();
  loadingSettlementReportsErrorTrigger$: Subject<void> = new Subject();
  loadingBatchErrorTrigger$: Subject<void> = new Subject();
  loadingBasisDataErrorTrigger$: Subject<void> = new Subject();
  loadingProcessStepResultsErrorTrigger$: Subject<void> = new Subject();
  loadingActorsErrorTrigger$: Subject<void> = new Subject();

  private document = inject(DOCUMENT);
  private httpClient = inject(WholesaleBatchHttp);
  private marketParticipantGridAreaHttpClient = inject(MarketParticipantGridAreaHttp);

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

  readonly setSettlementReports = this.updater(
    (state, settlementReports: settlementReportsProcess[]): State => ({
      ...state,
      settlementReports,
      loadingSettlementReports: false,
    })
  );

  readonly setProcessStepResults = this.updater(
    (state, processStepResults: ProcessStepResultDto | undefined): State => ({
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

  readonly setGridAreas = this.updater(
    (state, gridAreas: GridAreaDto[]): State => ({
      ...state,
      gridAreas,
    })
  );

  readonly createBatch = this.effect(
    (
      batch$: Observable<{
        gridAreas: string[];
        dateRange: { start: string; end: string };
      }>
    ) => {
      return batch$.pipe(
        switchMap((batch) => {
          this.setLoadingCreatingBatch(true);

          const batchRequest: BatchRequestDto = {
            processType: ProcessType.BalanceFixing,
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

  readonly getBatches = this.effect((filter$: Observable<BatchSearchDtoV2>) => {
    return filter$.pipe(
      switchMap((filter: BatchSearchDtoV2) => {
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

  readonly getSettlementRepports = this.effect(
    (filters$: Observable<SettlementReportsProcessFilters>) => {
      return filters$.pipe(
        switchMap((filters) => {
          this.setLoadingSettlementReports(true);

          return this.httpClient
            .v1WholesaleBatchSearchPost({
              filterByGridAreaCodes: filters.gridArea ? [filters.gridArea] : [],
              filterByExecutionState: 'Completed',
              minExecutionTime: filters.executionTime?.start,
              maxExecutionTime: filters.executionTime?.end,
              periodStart: filters.period?.start,
              periodEnd: filters.period?.end,
            })
            .pipe(
              tapResponse(
                (batches) => {
                  this.setSettlementReports(this.mapSettlementReports(batches, filters));
                },
                () => {
                  this.setLoadingSettlementReports(false);
                  this.loadingSettlementReportsErrorTrigger$.next();
                }
              )
            );
        })
      );
    }
  );

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
    (options$: Observable<ProcessStepResultRequestDtoV3>) => {
      return options$.pipe(
        switchMap((options) => {
          this.setProcessStepResults(undefined); // We reset the process step results to force the loading spinner to show
          return this.httpClient.v1WholesaleBatchProcessStepResultPost(options).pipe(
            tapResponse(
              (stepResults: ProcessStepResultDto) => this.setProcessStepResults(stepResults),
              () => this.loadingProcessStepResultsErrorTrigger$.next()
            )
          );
        })
      );
    }
  );

  readonly getActors = this.effect(
    (options$: Observable<{ batchId: string; gridAreaCode: string; marketRole: MarketRole }>) => {
      return options$.pipe(
        switchMap(({ batchId, gridAreaCode, marketRole }) => {
          return this.httpClient
            .v1WholesaleBatchActorsPost({
              batchId,
              gridAreaCode,
              type: TimeSeriesType.NonProfiledConsumption,
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

  readonly getZippedBasisData = this.effect((batch$: Observable<BatchDto>) => {
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
    (state, gridArea: GridAreaDto | undefined): State => ({
      ...state,
      selectedGridArea: gridArea,
    })
  );

  readonly getGridArea$ = (gridAreaCode: string): Observable<GridAreaDto | undefined> => {
    return this.selectedBatch$.pipe(
      map((x) => {
        return x?.gridAreas.filter((gridArea: GridAreaDto) => gridArea.code === gridAreaCode)[0];
      }),
      tap((gridArea) => this.setSelectedGridArea(gridArea))
    );
  };

  private getStatusType(status: BatchState): WattBadgeType {
    if (status === BatchState.Pending) {
      return 'warning';
    } else if (status === BatchState.Completed) {
      return 'success';
    } else if (status === BatchState.Failed) {
      return 'danger';
    } else {
      return 'info';
    }
  }

  private mapSettlementReports(
    batches: BatchDto[],
    filters: SettlementReportsProcessFilters
  ): settlementReportsProcess[] {
    if (!batches) return [];

    return batches
      .filter((batch) => batch.executionState === BatchState.Completed)
      .reduce((result: settlementReportsProcess[], batch) => {
        return result.concat(
          batch.gridAreas.map((gridArea) => ({
            ...batch,
            processType: ProcessType.BalanceFixing,
            gridAreaCode: gridArea.code,
            gridAreaName: gridArea.name,
          }))
        );
      }, [])
      .filter((settlementReport) => {
        if (filters.gridArea) {
          return filters.gridArea.includes(settlementReport.gridAreaCode);
        }
        return true;
      })
      .filter((settlementReport) => {
        if (filters.processType) {
          return filters.processType.includes(settlementReport.processType);
        }
        return true;
      });
  }
}
