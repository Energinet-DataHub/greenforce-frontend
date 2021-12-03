/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { filter, Observable, switchMap, tap } from 'rxjs';
import {
  MeteringPointCimDto,
  MeteringPointHttp,
} from '@energinet-datahub/dh/shared/data-access-api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

interface MeteringPointState {
  readonly meteringPoint?: MeteringPointCimDto;
  readonly meteringPointNotFound: boolean;
  readonly isLoading: boolean;
  readonly hasError: boolean;
}

const initialState: MeteringPointState = {
  meteringPoint: undefined,
  meteringPointNotFound: false,
  isLoading: false,
  hasError: false,
};

@Injectable()
export class DhMeteringPointDataAccessApiStore extends ComponentStore<MeteringPointState> {
  meteringPoint$ = this.select((state) => state.meteringPoint).pipe(
    filter((meteringPointId) => !!meteringPointId)
  );
  isLoading$ = this.select((store) => store.isLoading);
  meteringPointNotFound$ = this.select((store) => store.meteringPointNotFound);
  hasError$ = this.select((store) => store.hasError);

  isLoading$ = this.select((state) => state.isLoading);
  meteringPointNotFound$ = this.select((state) => state.meteringPointNotFound);
  hasError$ = this.select((state) => state.hasError);

  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }

  readonly loadMeteringPointData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
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
              (error: HttpErrorResponse) => this.handleError(error)
            )
          )
        )
      );
    }
  );

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
      isLoading,
    })
  );

  private updateMeteringPointNotFound = this.updater(
    (state, meteringPointNotFound: boolean): MeteringPointState => ({
      ...state,
      meteringPointNotFound,
    })
  );

  private upateError = this.updater(
    (state: MeteringPointState, hasError: boolean): MeteringPointState => ({
      ...state,
      meteringPoint: undefined,
      hasError,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    this.setLoading(false);

    const noMeteringPointData = undefined;
    this.updateMeteringPointData(noMeteringPointData);

    const meteringPointNotFound = error.status === HttpStatusCode.NotFound;
    this.updateMeteringPointNotFound(meteringPointNotFound);

    const otherResponseError = !meteringPointNotFound;
    this.upateError(otherResponseError);
  };

  private resetState = () => this.setState(initialState);
}
