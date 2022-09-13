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
import { Observable, exhaustMap } from 'rxjs';
import {
  WholesaleBatchHttp,
  WholesaleBatchRequestDto,
  WholesaleProcessType,
} from '@energinet-datahub/dh/shared/domain';
import { formatInTimeZone } from 'date-fns-tz';
import { parse } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

const initialState: State = {};

@Injectable()
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
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
            startDate: this.formatDate(batch.dateRange.start), // needs to be YYYY/MM/DD
            endDate: this.formatDate(batch.dateRange.end),
          };

          return this.httpClient.v1WholesaleBatchPost(batchRequest);
        })
      );
    }
  );
  private formatDate(value: string) : string {
    const dateTimeFormat = 'yyyy-MM-dd';
    const danishTimeZoneIdentifier = 'Europe/Copenhagen';
    let date = parse(value, 'dd-MM-yyyy', new Date());
    return formatInTimeZone(date, danishTimeZoneIdentifier, dateTimeFormat);
  }
}
