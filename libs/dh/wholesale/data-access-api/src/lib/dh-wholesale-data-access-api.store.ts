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
import { Observable, exhaustMap, switchMap, tap } from 'rxjs';
import {
  WholesaleBatchHttp,
  WholesaleBatchRequestDto,
  WholesaleProcessType,
  WholesaleSearchBatchDto,
  WholesaleSearchBatchResponseDto,
} from '@energinet-datahub/dh/shared/domain';
import { zonedTimeToUtc } from 'date-fns-tz';
import { parse } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {
  batches: WholesaleSearchBatchResponseDto[];
}

const initialState: State = { batches: [] };

@Injectable()
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  batches$ = this.select((x) => x.batches);
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
            startDate: this.formatDate(batch.dateRange.start),
            endDate: this.formatDate(batch.dateRange.end),
          };

          return this.httpClient.v1WholesaleBatchPost(batchRequest);
        })
      );
    }
  );
  private formatDate(value: string): string {
    const date = parse(value, 'dd-MM-yyyy', new Date());
    return zonedTimeToUtc(date, 'Europe/Copenhagen').toISOString();
  }
  readonly setBarches = this.updater(
    (state, value: WholesaleSearchBatchResponseDto[]) => ({
      ...state,
      batches: value,
    })
  );
  readonly getBatches = this.effect(
    (filter$: Observable<WholesaleSearchBatchDto>) => {
      return filter$.pipe(
        switchMap((filter: WholesaleSearchBatchDto) => {
          return this.httpClient
            .v1WholesaleBatchSearchGet(filter)
            .pipe(tap((batches) => this.setBarches(batches)));
        })
      );
    }
  );
}
