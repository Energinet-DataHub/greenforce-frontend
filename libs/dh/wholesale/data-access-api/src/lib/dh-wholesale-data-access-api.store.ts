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
import { Injectable } from '@angular/core';
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
  WholesaleBatchRequestDto,
  WholesaleProcessType,
  WholesaleSearchBatchDto,
  WholesaleSearchBatchResponseDto,
} from '@energinet-datahub/dh/shared/domain';

interface State {
  batches?: WholesaleSearchBatchResponseDto[];
}

const initialState: State = {};

@Injectable()
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  batches$ = this.select((x) => x.batches);
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();
  loadingBatchesTrigger$: Subject<void> = new Subject();

  constructor(private httpClient: WholesaleBatchHttp) {
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
          const batchRequest: WholesaleBatchRequestDto = {
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
    (state, value: WholesaleSearchBatchResponseDto[]): State => ({
      ...state,
      batches: value,
    })
  );

  readonly getBatches = this.effect(
    (filter$: Observable<WholesaleSearchBatchDto>) => {
      return filter$.pipe(
        tap(() => this.loadingBatchesTrigger$.next()),
        switchMap((filter: WholesaleSearchBatchDto) => {
          const searchBatchesRequest: WholesaleSearchBatchDto = {
            minExecutionTime: this.formatDate(filter.minExecutionTime),
            maxExecutionTime: this.formatDate(filter.maxExecutionTime),
          };

          return this.httpClient
            .v1WholesaleBatchSearchPost(searchBatchesRequest)
            .pipe(
              tap((batches) => this.setBatches(batches)),
              catchError(() => {
                this.loadingBatchesErrorTrigger$.next();
                return EMPTY;
              })
            );
        })
      );
    }
  );

  private formatDate(value: string): string {
    const date = parse(value, 'dd-MM-yyyy', new Date());
    return zonedTimeToUtc(date, 'Europe/Copenhagen').toISOString();
  }
}
