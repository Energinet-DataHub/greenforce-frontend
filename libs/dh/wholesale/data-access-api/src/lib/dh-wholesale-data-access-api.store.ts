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
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  Observable,
  exhaustMap,
  switchMap,
  tap,
  Subject,
  catchError,
  EMPTY,
} from 'rxjs';
import {
  WholesaleBatchHttp,
  BatchRequestDto,
  WholesaleProcessType,
  BatchSearchDto,
  BatchDtoV2,
} from '@energinet-datahub/dh/shared/domain';

interface State {
  batches?: BatchDtoV2[];
  loadingBatches: boolean;
}

const initialState: State = {
  loadingBatches: false,
};

@Injectable()
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  batches$ = this.select((x) => x.batches);
  loadingBatches$ = this.select((x) => x.loadingBatches);
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();

  constructor(
    private httpClient: WholesaleBatchHttp,
    private changeDetectorRef: ChangeDetectorRef
  ) {
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
            processType: WholesaleProcessType.BalanceFixing,
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
    (state, value: BatchDtoV2[]): State => ({
      ...state,
      batches: value,
      loadingBatches: false,
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
        this.changeDetectorRef.detectChanges();
      }),
      switchMap((filter: BatchSearchDto) => {
        const searchBatchesRequest: BatchSearchDto = {
          minExecutionTime: filter.minExecutionTime,
          maxExecutionTime: this.addTimeToDate(filter.maxExecutionTime),
        };

        return this.httpClient
          .v1WholesaleBatchSearchPost(searchBatchesRequest)
          .pipe(
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

  readonly getZippedBasisData = this.effect(
    (
      batch$: Observable<{
        id: string;
      }>
    ) => {
      return batch$.pipe(
        exhaustMap((batch) => {
          const batchId: string = batch.id;

          return this.httpClient.v1WholesaleBatchZippedBasisDataStreamPost(
            batchId
          );
        })
      );
    }
  );

  // TODO: This should be removed when the design system has implemented a proper fix in the date picker (Mighty Ducks will do this refactor)
  private addTimeToDate(date: string): string {
    const withTime = new Date(date).setHours(23, 59, 59, 999);
    return new Date(withTime).toISOString();
  }
}
