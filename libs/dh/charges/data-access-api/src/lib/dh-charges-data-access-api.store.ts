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
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import {
  ChargeLinkDto,
  ChargeLinksHttp,
  ChargeType,
} from '@energinet-datahub/dh/shared/data-access-api';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export const enum ErrorState {
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  GENERAL_ERROR = 'GENERAL_ERROR',
}

interface ChargesState {
  readonly charges?: Array<ChargeLinkDto>;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ChargesState = {
  charges: undefined,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhChargesDataAccessApiStore extends ComponentStore<ChargesState> {
  tariffs$: Observable<Array<ChargeLinkDto>> = this.select(
    (state) => state.charges
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkDto>),
    map((charges) =>
      charges.filter((charge) => charge.chargeType === ChargeType.D03)
    )
  );

  subscriptions$: Observable<Array<ChargeLinkDto>> = this.select(
    (state) => state.charges
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkDto>),
    map((charges) =>
      charges.filter((charge) => charge.chargeType === ChargeType.D01)
    )
  );

  fees$: Observable<Array<ChargeLinkDto>> = this.select(
    (state) => state.charges
  ).pipe(
    filter((charges) => !!charges),
    map((charges) => charges as Array<ChargeLinkDto>),
    map((charges) =>
      charges.filter((charge) => charge.chargeType === ChargeType.D02)
    )
  );

  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  chargesNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: ChargeLinksHttp) {
    super(initialState);
  }

  readonly loadChargesData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(true);
        }),
        switchMap((id) =>
          this.httpClient.v1ChargeLinksGet(id).pipe(
            tapResponse(
              (chargesData) => {
                this.setLoading(false);

                this.updateChargesData(chargesData);
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

  private updateChargesData = this.updater(
    (
      state: ChargesState,
      chargesData: Array<ChargeLinkDto> | undefined
    ): ChargesState => ({
      ...state,
      charges: chargesData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ChargesState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const chargesData = undefined;
    this.updateChargesData(chargesData);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
