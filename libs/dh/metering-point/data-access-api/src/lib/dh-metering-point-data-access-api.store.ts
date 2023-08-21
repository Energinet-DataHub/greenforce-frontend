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
import { MeteringPointCimDto, MeteringPointHttp } from '@energinet-datahub/dh/shared/domain';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorState, LoadingState } from './states';

interface MeteringPointState {
  readonly meteringPoint?: MeteringPointCimDto;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: MeteringPointState = {
  meteringPoint: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhMeteringPointDataAccessApiStore extends ComponentStore<MeteringPointState> {
  meteringPoint$: Observable<MeteringPointCimDto> = this.select(
    (state) => state.meteringPoint
  ).pipe(
    filter((meteringPoint) => !!meteringPoint),
    map((meteringPoint) => meteringPoint as MeteringPointCimDto)
  );
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  meteringPointNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }

  readonly loadMeteringPointData = this.effect((meteringPointId$: Observable<string>) => {
    return meteringPointId$.pipe(
      tap(() => {
        this.resetState();

        this.setLoading(true);
      }),
      switchMap((id) =>
        this.httpClient.v1MeteringPointGetByGsrnGet(id).pipe(
          tapResponse(
            (meteringPointData) => {
              this.setLoading(false);

              this.updateMeteringPointData(meteringPointData);
            },
            (error: HttpErrorResponse) => {
              this.setLoading(false);

              this.handleError(error);
            }
          )
        )
      )
    );
  });

  private updateMeteringPointData = this.updater(
    (
      state: MeteringPointState,
      meteringPointData: MeteringPointCimDto | undefined
    ): MeteringPointState => ({
      ...state,
      meteringPoint: meteringPointData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): MeteringPointState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const meteringPointData = undefined;
    this.updateMeteringPointData(meteringPointData);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
