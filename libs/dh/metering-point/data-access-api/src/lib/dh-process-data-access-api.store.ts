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
  MeteringPointHttp, Process
} from '@energinet-datahub/dh/shared/data-access-api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export const enum ErrorState {
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  GENERAL_ERROR = 'GENERAL_ERROR',
}

interface ProcessesState {
  readonly processes: Process[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ProcessesState = {
  processes: [],
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhProcessDataAccessApiStore extends ComponentStore<ProcessesState> {
  processes$: Observable<Process[]> = this.select(
    (state) => state.processes
  ).pipe(
    filter((processes) => !!processes),
    map((processes) => processes as Process[])
  );
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  processesNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }

  readonly loadProcessData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(true);
        }),
        switchMap((id) =>
          this.httpClient.v1MeteringPointGetProcessesByGsrnGet(id).pipe(
            tapResponse(
              (processesData) => {
                this.setLoading(false);

                this.updateProcessesData(processesData);
              },
              (error: HttpErrorResponse) => {
                this.setLoading(false);

                this.handleError(error);
              }
            )
          )
        )
      );
    }
  );

  private updateProcessesData = this.updater(
    (
      state: ProcessesState,
      processesData: Process[]
    ): ProcessesState => ({
      ...state,
      processes: processesData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ProcessesState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const processesData: Process[] = [];
    this.updateProcessesData(processesData);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
