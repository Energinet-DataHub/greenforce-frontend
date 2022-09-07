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
import { Observable, switchMap } from 'rxjs';
import {
  WholesaleBatchHttp,
  WholesaleBatchRequestDto,
  WholesaleProcessType,
} from '@energinet-datahub/dh/shared/domain';

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
      object$: Observable<{
        gridAreas: string[];
        dateRange: { start: string; end: string } | null;
      }>
    ) => {
      return object$.pipe(
        switchMap((object) => {
          const batchRequest: WholesaleBatchRequestDto = {
            processType: WholesaleProcessType.BalanceFixing,
            gridAreaCodes: object.gridAreas,
            startDate: object.dateRange!.start,
            endDate: object.dateRange!.end,
          };
          console.log(batchRequest);
          return this.httpClient.v1WholesaleBatchPost(batchRequest);
        })
      );
    }
  );
}
