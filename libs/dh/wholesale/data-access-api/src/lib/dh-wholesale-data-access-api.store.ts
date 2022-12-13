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
import { ComponentStore } from '@ngrx/component-store';
import {
  Observable,
  exhaustMap,
  switchMap,
  tap,
  Subject,
  catchError,
  EMPTY,
  map,
} from 'rxjs';

import {
  WholesaleBatchHttp,
  BatchRequestDto,
  ProcessType,
  BatchSearchDto,
  BatchState,
  BatchDto,
  GridAreaDto,
  ProcessStepResultRequestDto,
  ProcessStepResultDto,
} from '@energinet-datahub/dh/shared/domain';
import { batch } from '@energinet-datahub/dh/wholesale/domain';

import type { WattBadgeType } from '@energinet-datahub-types/watt/badge';

interface State {
  batches?: batch[];
  processStepResults?: ProcessStepResultDto;
  loadingBatches: boolean;
  selectedBatch?: batch;
  selectedGridArea?: GridAreaDto;
}

const initialState: State = {
  loadingBatches: false,
};

@Injectable({
  providedIn: 'root',
})
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  batches$ = this.select((x) => x.batches);
  selectedBatch$ = this.select((x) => x.selectedBatch);
  selectedGridArea$ = this.select((x) => x.selectedGridArea);
  processStepResults$ = this.select((x) => x.processStepResults);

  loadingBatches$ = this.select((x) => x.loadingBatches);
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();
  loadingBasisDataErrorTrigger$: Subject<void> = new Subject();

  loadingBatchErrorTrigger$: Subject<void> = new Subject();
  loadingProcessStepResultsErrorTrigger$: Subject<void> = new Subject();

  private document = inject(DOCUMENT);
  private httpClient = inject(WholesaleBatchHttp);

  constructor() {
    super(initialState);
  }

  readonly createBatch = this.effect(
    (
      batch$: Observable<{
        gridAreas: string[];
        dateRange: { start: string; end: string };
      }>
    ) => {
      return batch$.pipe(
        exhaustMap((batch) => {
          const batchRequest: BatchRequestDto = {
            processType: ProcessType.BalanceFixing,
            gridAreaCodes: batch.gridAreas,
            startDate: batch.dateRange.start,
            endDate: batch.dateRange.end,
          };

          return this.httpClient.v1WholesaleBatchPost(batchRequest);
        })
      );
    }
  );

  readonly setBatches = this.updater(
    (state, batches: batch[]): State => ({
      ...state,
      batches: batches,
      loadingBatches: false,
    })
  );

  readonly setProcessStepResults = this.updater(
    (state, processStepResults: ProcessStepResultDto): State => ({
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

  readonly getBatches = this.effect((filter$: Observable<BatchSearchDto>) => {
    return filter$.pipe(
      tap(() => {
        this.setLoadingBatches(true);
      }),
      switchMap((filter: BatchSearchDto) => {
        const searchBatchesRequest: BatchSearchDto = {
          minExecutionTime: filter.minExecutionTime,
          maxExecutionTime: filter.maxExecutionTime,
        };

        return this.httpClient
          .v1WholesaleBatchSearchPost(searchBatchesRequest)
          .pipe(
            map((batches) => {
              return batches.map((batch) => {
                return {
                  ...batch,
                  statusType: this.getStatusType(batch.executionState),
                };
              });
            }),
            tap((batches) => this.setBatches(batches)),
            catchError(() => {
              this.setLoadingBatches(false);
              this.loadingBatchesErrorTrigger$.next();
              return EMPTY;
            })
          );
      })
    );
  });

  readonly getBatch = this.effect((batchNumber$: Observable<string>) => {
    return batchNumber$.pipe(
      switchMap((batchNumber) => {
        return this.httpClient.v1WholesaleBatchBatchGet(batchNumber).pipe(
          map((batch) => {
            return {
              ...batch,
              statusType: this.getStatusType(batch.executionState),
            };
          }),
          tap((batch) => {
            this.setSelectedBatch(batch);
          }),
          catchError(() => {
            this.loadingBatchErrorTrigger$.next();
            return EMPTY;
          })
        );
      })
    );
  });

  readonly getProcessStepResults = this.effect(
    (options$: Observable<ProcessStepResultRequestDto>) => {
      return options$.pipe(
        switchMap((options) => {
          return this.httpClient
            .v1WholesaleBatchProcessStepResultPost(options)
            .pipe(
              tap((stepResults: ProcessStepResultDto) => {
                this.setProcessStepResults(stepResults);
              }),
              catchError(() => {
                this.loadingProcessStepResultsErrorTrigger$.next();
                return EMPTY;
              })
            );
        })
      );
    }
  );

  readonly getZippedBasisData = this.effect((batch$: Observable<BatchDto>) => {
    return batch$.pipe(
      switchMap((batch) => {
        return this.httpClient
          .v1WholesaleBatchZippedBasisDataStreamGet(batch.batchId)
          .pipe(
            tap((data) => {
              const blob = new Blob([data as unknown as BlobPart], {
                type: 'application/zip',
              });
              const basisData = window.URL.createObjectURL(blob);
              const link = this.document.createElement('a');
              link.href = basisData;
              link.download = `${batch.batchId}.zip`;
              link.click();
            }),
            catchError(() => {
              this.loadingBasisDataErrorTrigger$.next();
              return EMPTY;
            })
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

  readonly getGridArea$ = (
    gridAreaCode: string
  ): Observable<GridAreaDto | undefined> => {
    return this.selectedBatch$.pipe(
      map((x) => {
        return x?.gridAreas.filter(
          (gridArea: GridAreaDto) => gridArea.code === gridAreaCode
        )[0];
      })
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
}
