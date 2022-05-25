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
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import {
  WholesaleJobV1Dto,
  WholesaleJobHttp,
} from '@energinet-datahub/dh/shared/domain';

interface State {
  readonly jobs: WholesaleJobV1Dto[];
}

const initialState: State = {
  jobs: []
};

@Injectable()
export class DhWholesaleJobDataAccessApiStore extends ComponentStore<State> {
  constructor(private httpClient: WholesaleJobHttp) {
    super(initialState);
  }

  readonly jobs$: Observable<WholesaleJobV1Dto[]> = this.select(state => state.jobs);

  readonly createWholesaleJobs = this.effect(
    (gridAreas$: Observable<string[]>) => {
      return gridAreas$.pipe(
        switchMap(gridAreas =>
          this.httpClient.v1WholesaleJobStartJobsPost("BalanceFixing", gridAreas, undefined)
        )
      )
    }
  );

  loadJobsData() {
    var jobs = this.httpClient.v1WholesaleJobGetJobsGet(100);
    this.updateJobsData(jobs);
  }

  private updateJobsData = this.updater(
    (state: State, jobsData: WholesaleJobV1Dto[]): State => ({
      ...state,
      jobs: jobsData,
    })
  );
}
